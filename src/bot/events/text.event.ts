import type { Telegraf } from "telegraf";

import { askGenerateRecipe } from "../../modules/chat/chat.service";
import { IGenerateRecipe } from "../../modules/chat/chat.types";
import { convertUnit } from "../../shared/utils/unit-converter";
import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";
import { deleteMessages } from "../handlers/delete-messages.handler";
import { recipeRepository } from "../../modules/recipe/recipe.repository";

export function textEvent(bot: Telegraf<TelegrafContext>) {
  bot.on("text", async (ctx) => {
    let text = ctx.text;
    if (ctx.session.state === "geneate_recipe") {
      ctx
        .reply(`Пожалуйста, подождите, идет генерация рецепта из ${text} ... `)
        .then(async ({ message_id }) => {
          const generatedRecipe: IGenerateRecipe | null =
            await askGenerateRecipe(text);

          ctx.session.deleteMessages.push(message_id);
          if (!generatedRecipe) {
            ctx.reply(
              "Произошла ошибка при генерации рецепта. Пожалуйста, попробуйте еще раз.",
            );
            ctx.session.state = null;
            return;
          }
          const recipe = {
            userId: String(ctx.from.id),
            title: generatedRecipe.title || "Без названия",
            ingredients: generatedRecipe.ingredients.map((ingredient) =>
              JSON.stringify(ingredient),
            ),
            instructions: generatedRecipe.reciept || [],
          };
          ctx.session.lastRecipe = JSON.stringify(recipe);

          ctx.reply(
            `*Введение продукты:* ${text}\n\n*${recipe.title}*\n\n*Ингредиенты:*\n${generatedRecipe.ingredients
              .map(
                ({ name, unit, weight }) =>
                  `${name.trim()}: ${weight}${convertUnit(unit).trim()}`,
              )
              .join(
                "\n",
              )}\n\n*Рецепт:*\n${generatedRecipe.reciept.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
            {
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "Сохранить", callback_data: "save_recipe" }],
                  [
                    {
                      text: "Сгенерировать еще раз",
                      callback_data: "generate_recipe",
                    },
                  ],
                ],
              },
            },
          );
        });
      deleteMessages(ctx);
      ctx.session.state = "confirm_recipe";
    }
    if (ctx.session.state === "create_food_group") {
      if (!text) {
        ctx.answerCbQuery("Пожалуйста, введите название группы.");
        return;
      }
      const data = { name: text.trim(), ownerId: String(ctx.from.id) };
      recipeRepository.createFoodGroup(data);
      ctx.answerCbQuery(`Группа ${text} создана!`);
      ctx.session.state = null;
    }
  });
}
