import { Telegraf } from "telegraf";
import { userRepository } from "../../modules/user/user.repository";
import { resetStates, states } from "../states";

export function startHandler(bot: Telegraf) {
  bot.start(async (ctx) => {
    resetStates(states);
    const {
      id: telegramId,
      username,
      first_name: firstName,
      last_name: lastName,
    } = ctx.from;
    const user = await userRepository.createUser({
      telegramId: String(telegramId),
      username,
      firstName,
      lastName,
    });
    if (user) ctx.reply("Привет, напиши /recipe чтобы сгенерировать рецепт");
    else ctx.reply("Бот в данный момент не доступен.\nПопробуйте зайти позже.");
  });
}
