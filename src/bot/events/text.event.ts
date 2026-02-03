import type { Telegraf } from "telegraf";
import { deleteIds, resetStates, states } from "../states";
import { askGenerateRecipe } from "../../modules/chat/chat.service";
import { IGenerateRecipe } from "../../modules/chat/chat.types";
import { convertUnit } from "../../shared/utils/unit-converter";

export function textEvent(bot: Telegraf) {
  bot.on("text", async (ctx) => {
    let text = ctx.text;
    if (states.generate_recipe) {
      ctx.reply(`Генерация рецепта из: ${text}`).then(({ message_id }) => {
        deleteIds.push(message_id);
      });

      resetStates(states);
      ctx
        .reply("Пожалуйста, подождите, идет генерация рецепта...")
        .then(async ({ message_id }) => {
          const recipe: IGenerateRecipe | null = await askGenerateRecipe(text);
          deleteIds.push(message_id);
          if (!recipe) {
            ctx.reply(
              "Произошла ошибка при генерации рецепта. Пожалуйста, попробуйте еще раз.",
            );
            return;
          }
          ctx
            .reply(
              `*Введение продукты:* ${text}\n\n*${recipe.name}*\n\n*Ингредиенты:*\n${recipe.ingredients
                .map(
                  ({ name, unit, weight }) =>
                    `${name.trim()}: ${weight}${convertUnit(unit).trim()}`,
                )
                .join(
                  "\n",
                )}\n\n*Рецепт:*\n${recipe.reciept.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
              { parse_mode: "Markdown" },
            )
            .then(() => {
              ctx.deleteMessages(deleteIds);
              return;
            });
        });
    }
  });
}
