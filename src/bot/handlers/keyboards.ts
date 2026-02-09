import { Markup } from "telegraf";
import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";
import { ENV } from "../../config/env";
import { resetSession } from "../../shared/utils/reset-states";

export function keyboardSaveRecipe() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Сохранить", "save_recipe"),
  ]);
}

export async function mainKeyboard(ctx: TelegrafContext) {
  await resetSession(ctx);
  return await ctx
    .reply("Что будем готовить сегодня?", {
      reply_markup: {
        inline_keyboard:
          ENV.NODE_ENV === "development"
            ? [
                [
                  {
                    text: "Сохраненные рецепты",
                    callback_data: "get_food_groups",
                  },
                ],
                [
                  {
                    text: "Сгенерировать рецепт",
                    callback_data: "generate_recipe",
                  },

                  {
                    text: "Текущая сессия",
                    callback_data: "current_session",
                  },
                ],
              ]
            : [
                [
                  {
                    text: "Сохраненные рецепты",
                    callback_data: "get_food_groups",
                  },
                ],
                [
                  {
                    text: "Сгенерировать рецепт",
                    callback_data: "generate_recipe",
                  },
                ],
              ],
      },
    })
    .then(({ message_id }) => {
      ctx.session.deleteMessages.push(message_id);
    });
}
