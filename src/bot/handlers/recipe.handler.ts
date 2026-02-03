import type { Telegraf } from "telegraf";
import { deleteIds } from "../states";

export function recipeHandler(bot: Telegraf) {
  bot.command("recipe", (ctx) =>
    ctx
      .reply("Выберите опцию:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Сгенерировать рецепт",
                callback_data: "generate_recipe",
              },
              { text: "Сохраненные рецепты", callback_data: "saved_recipes" },
            ],
          ],
        },
      })
      .then(({ message_id }) => deleteIds.push(message_id)),
  );
}
