import { askGenerateRecipe } from "../../../modules/chat/chat.service";
import { IGenerateRecipe } from "../../../modules/chat/chat.types";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { convertUnit } from "../../../shared/utils/unit-converter";
import { deleteMessages } from "../../../shared/utils/delete-messages.handler";

export async function generateRecipeEvent(
  ctx: TelegrafContext,
  telegramId: string,
  text: string,
) {
  ctx.session.products = text;
  await ctx
    .reply(`Пожалуйста, подождите, идет генерация рецепта из ${text} ... `)
    .then(async ({ message_id }) => {
      const generatedRecipe: IGenerateRecipe | null =
        await askGenerateRecipe(text);

      ctx.session.deleteMessages.push(message_id);

      if (!generatedRecipe) {
        await ctx
          .reply(
            "Произошла ошибка при генерации рецепта. Пожалуйста, попробуйте еще раз.",
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Попробовать снова",
                      callback_data: "generate_recipe",
                    },
                  ],
                  [
                    {
                      text: "Ввести продукты заново",
                      callback_data: "cancel_recipe",
                    },
                    {
                      text: "Назад",
                      callback_data: "menu",
                    },
                  ],
                ],
              },
            },
          )
          .then((message) =>
            ctx.session.deleteMessages.push(message.message_id),
          );
        return;
      }
      const recipe = {
        userId: telegramId,
        title: generatedRecipe.title || "Без названия",
        ingredients: generatedRecipe.ingredients.map((ingredient) =>
          JSON.stringify(ingredient),
        ),
        instructions: generatedRecipe.reciept || [],
      };
      ctx.session.lastRecipe = JSON.stringify(recipe);

      await ctx.reply(
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
                  callback_data: "cancel_recipe",
                },
              ],
            ],
          },
        },
      );

      await deleteMessages(ctx);
      ctx.session.state = "confirm_recipe";
      ctx.session.products = "";
    });
}
