import type { Telegraf } from "telegraf";
import { deleteIds, states } from "../states";

export function callbackEvent(bot: Telegraf) {
  bot.on("callback_query", async (ctx) => {
    if (
      "data" in ctx.callbackQuery &&
      ctx.callbackQuery.data === "generate_recipe"
    ) {
      states.generate_recipe = true;
      await ctx
        .reply("Пожалуйста, введите данные для генерации рецепта.")
        .then(({ message_id }) => deleteIds.push(message_id));
    }
  });
}
