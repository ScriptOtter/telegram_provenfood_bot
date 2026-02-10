import { Markup } from "telegraf";
import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";
import { ENV } from "../../config/env";
import { resetSession } from "../../shared/utils/reset-states";
import { FoodGroup, Recipe } from "../../../prisma/generated/client";
import { recipeRepository } from "../../modules/recipe/recipe.repository";

export function keyboardSaveRecipe() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Сохранить", "save_recipe"),
  ]);
}

export function getRecipesFromFoodGroupKeyboard(recipes: Recipe[]) {
  return [
    ...recipes.map((recipe) => [
      { text: recipe.title, callback_data: `recipe_${recipe.id}` },
    ]),
  ];
}

export function getFoodGroupKeyboard(foodGroups: FoodGroup[]) {
  return [
    ...foodGroups.map((fg) => [
      { text: fg.name, callback_data: `food_group_${fg.id}` },
    ]),
    [{ text: "⬅️ Меню", callback_data: "menu" }],
  ];
}

export function backToMenu() {
  return [[{ text: "⬅️ Назад", callback_data: "menu" }]];
}

export function menuKeyboard() {
  return ENV.NODE_ENV === "development"
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
      ];
}

export async function getMenu(ctx: TelegrafContext) {
  await resetSession(ctx);
  const foodGroups = await recipeRepository.findFoodGroupsByTelegramId(
    ctx.session.id!,
  );
  let message = "Что будем готовить сегодня?\n";
  if (!foodGroups)
    message += `У вас пока нет групп рецептов.\nСоздайте новую группу с помощью команды /create_food_group`;
  if (ctx.text === "Начать" || ctx.from?.id === ctx.session.id)
    return await ctx
      .reply(message, {
        reply_markup: {
          inline_keyboard: menuKeyboard(),
        },
      })
      .then((message) => ctx.session.deleteMessages.push(message.message_id));
  return await ctx.editMessageText(message, {
    reply_markup: {
      inline_keyboard: menuKeyboard(),
    },
  });
}
