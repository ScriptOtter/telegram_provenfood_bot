import { Telegraf } from "telegraf";

export function startHandler(bot: Telegraf) {
  bot.start((ctx) =>
    ctx.reply("Привет, напиши /recipe чтобы сгенерировать рецепт"),
  );
}
