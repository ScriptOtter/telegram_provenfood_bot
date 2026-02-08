import { Telegraf } from "telegraf";

export function helpHandler(bot: Telegraf) {
  bot.help((ctx) =>
    ctx.reply("Привет, напиши /recipe чтобы сгенерировать рецепт"),
  );
}
