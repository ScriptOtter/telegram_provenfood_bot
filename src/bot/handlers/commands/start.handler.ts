import { Markup, Telegraf } from "telegraf";
import { userRepository } from "../../../modules/user/user.repository";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export async function startHandler(bot: Telegraf<TelegrafContext>) {
  bot.start(async (ctx) => {
    ctx.session.state = null;
    const {
      id: telegramId,
      username,
      first_name: firstName,
      last_name: lastName,
    } = ctx.from;
    ctx.session.deleteMessages.push(ctx.message.message_id);
    ctx.session.id = String(telegramId);
    const user = await userRepository.createUser({
      telegramId: String(telegramId),
      username,
      firstName,
      lastName,
    });
    if (user && ctx.session.id)
      await ctx
        .reply(
          "Привет, напиши добро пожаловать в бота!",
          Markup.keyboard(["Начать"]).resize(),
        )
        .then((message) => {
          ctx.session.deleteMessages.push(message.message_id);
        });
    else
      await ctx
        .reply("Бот в данный момент не доступен.\nПопробуйте зайти позже.")
        .then((message) => {
          ctx.session.deleteMessages.push(message.message_id);
        });
  });
}
