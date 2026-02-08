import type { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { ENV } from "../../../config/env";

export function recipeHandler(bot: Telegraf<TelegrafContext>) {
  bot.command("recipe", (ctx) =>
    ctx
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
      .then(({ message_id }) => ctx.session.deleteMessages.push(message_id)),
  );
}
