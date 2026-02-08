import { Telegraf } from "telegraf";
import { userRepository } from "../../../modules/user/user.repository";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export function startHandler(bot: Telegraf<TelegrafContext>) {
  bot.start(async (ctx) => {
    ctx.session.state = null;
    const {
      id: telegramId,
      username,
      first_name: firstName,
      last_name: lastName,
    } = ctx.from;
    ctx.session.id = String(telegramId);
    const user = await userRepository.createUser({
      telegramId: String(telegramId),
      username,
      firstName,
      lastName,
    });
    if (user && ctx.session.id)
      ctx.reply("Привет, напиши /recipe чтобы сгенерировать рецепт");
    else ctx.reply("Бот в данный момент не доступен.\nПопробуйте зайти позже.");
  });
}
