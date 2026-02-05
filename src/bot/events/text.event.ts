import type { Telegraf } from "telegraf";
import { deleteIds, resetStates, states } from "../states";
import { askGenerateRecipe } from "../../modules/chat/chat.service";
import { IGenerateRecipe } from "../../modules/chat/chat.types";
import { convertUnit } from "../../shared/utils/unit-converter";
import { recipeRepository } from "../../modules/recipe/recipe.repository";
import { keyboardSaveRecipe } from "../handlers/keyboards";

export function textEvent(bot: Telegraf) {
  bot.on("text", async (ctx) => {
    let text = ctx.text;
    if (states.generate_recipe) {
      ctx.reply(`Генерация рецепта из: ${text}`).then(({ message_id }) => {
        deleteIds.push(message_id);
      });

      ctx
        .reply("Пожалуйста, подождите, идет генерация рецепта...")
        .then(async ({ message_id }) => {
          const recipe: IGenerateRecipe | null = await askGenerateRecipe(text);

          deleteIds.push(message_id);
          if (!recipe) {
            ctx.reply(
              "Произошла ошибка при генерации рецепта. Пожалуйста, попробуйте еще раз.",
            );
            resetStates(states);
            return;
          }
          await recipeRepository.createRecipe({
            userId: String(ctx.from.id),
            title: recipe.title || "Без названия",
            ingredients: { createMany: { data: recipe.ingredients } },
            instructions: recipe.reciept || [],
          });

          ctx.reply(
            `*Введение продукты:* ${text}\n\n*${recipe.title}*\n\n*Ингредиенты:*\n${recipe.ingredients
              .map(
                ({ name, unit, weight }) =>
                  `${name.trim()}: ${weight}${convertUnit(unit).trim()}`,
              )
              .join(
                "\n",
              )}\n\n*Рецепт:*\n${recipe.reciept.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
            {
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "Сохранить", callback_data: "save_recipe" }],
                ],
              },
            },
          );
        });
      ctx.deleteMessages(deleteIds);
      resetStates(states);
      states.awaiting_click = true;
    }
  });
}

function escapeMarkdownV2(text) {
  if (!text) return "";
  return String(text)
    .replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1")
    .replace(/-/g, "\\-");
}
