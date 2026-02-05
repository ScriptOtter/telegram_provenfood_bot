import type { Telegraf } from "telegraf";
import { deleteIds, resetStates, states } from "../states";
import { recipeRepository } from "../../modules/recipe/recipe.repository";

export function callbackEvent(bot: Telegraf) {
  bot.on("callback_query", (ctx) => {
    if (
      "data" in ctx.callbackQuery &&
      ctx.callbackQuery.data === "generate_recipe"
    ) {
      states.generate_recipe = true;
      ctx
        .reply("Пожалуйста, введите данные для генерации рецепта.")
        .then(({ message_id }) => deleteIds.push(message_id));
    }
    if (
      "data" in ctx.callbackQuery &&
      ctx.callbackQuery.data === "saved_recipes"
    ) {
      states.saved_recipes = true;

      ctx.reply("1234").then(({ message_id }) => deleteIds.push(message_id));
      resetStates(states);
      return;
    }
    if (
      "data" in ctx.callbackQuery &&
      ctx.callbackQuery.data === "save_recipe"
    ) {
      states.awaiting_click = false;

      ctx.reply("Рецепт сохранен!");
    }
  });
}
