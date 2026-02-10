import { Telegraf } from "telegraf";
import { prismaService } from "../../../infrastructure/prisma/prisma.client";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { recipeRepository } from "../../../modules/recipe/recipe.repository";
import {
  backToMenu,
  getFoodGroupKeyboard,
  getRecipesFromFoodGroupKeyboard,
} from "../keyboards";
import { convertUnit } from "../../../shared/utils/unit-converter";

export async function getFoodGroup(ctx: TelegrafContext) {
  const ownerId = ctx.session.id;
  if (!ownerId) {
    return await ctx.editMessageText(
      "Ошибка: не удалось определить ID пользователя.",
      {
        reply_markup: { inline_keyboard: backToMenu() },
      },
    );
  }
  const foodGroups = await prismaService.foodGroup.findMany({
    where: { ownerId },
  });
  if (foodGroups.length === 0) {
    return await ctx.editMessageText(
      "У вас пока нет групп рецептов, нажмите /create_food_group для создания новой группы.",
      {
        reply_markup: { inline_keyboard: backToMenu() },
      },
    );
  }

  await ctx.editMessageText(
    `Ваши группы рецептов:\nСоздать новую группу /create_food_group`,
    {
      reply_markup: {
        inline_keyboard: getFoodGroupKeyboard(foodGroups),
      },
    },
  );

  ctx.answerCbQuery();
}

export async function saveRecipeInFoodGroup(ctx: TelegrafContext) {
  const ownerId = ctx.session.id;
  if (!ownerId) {
    return await ctx.editMessageText(
      "Ошибка: не удалось определить ID пользователя.",
      {
        reply_markup: { inline_keyboard: backToMenu() },
      },
    );
  }
  ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  const foodGroups = await recipeRepository.findFoodGroupsByTelegramId(ownerId);

  if (!foodGroups) {
    return ctx.reply(
      `У вас пока нет групп рецептов, пропишите /create_food_group для создания новой группы и попробуйсте снова`,
      {
        reply_markup: { inline_keyboard: backToMenu() },
      },
    );
  }

  ctx
    .reply(`Выберите группу для сохранения рецепта:`, {
      reply_markup: {
        inline_keyboard: getFoodGroupKeyboard(foodGroups),
      },
    })
    .then((message) => ctx.session.deleteMessages.push(message.message_id));

  ctx.answerCbQuery();
}

export async function pickFoodGroupAction(bot: Telegraf<TelegrafContext>) {
  bot.action(/^food_group_([a-z0-9]+)$/, async (ctx) => {
    const match = ctx.match;
    const groupId = match[1];
    if (ctx.session.lastRecipe) {
      const recipe = JSON.parse(ctx.session.lastRecipe);
      const userId = ctx.session.id;
      const result = recipeRepository.createRecipe({
        ...recipe,
        userId,
        groupId,
      });
      if (!result) {
        return ctx.reply(
          "Ошибка при сохранении рецепта. Пожалуйста, попробуйте еще раз.",
        );
      }

      ctx.answerCbQuery();
      ctx.editMessageText(`Рецепт ${recipe.title} успешно сохранен`, {
        reply_markup: { inline_keyboard: backToMenu() },
      });
    } else {
      const myRecipes = await recipeRepository.findRecipesFromFoodGroup(
        ctx.session.id!,
        groupId,
      );
      if (!myRecipes) {
        return ctx.reply("Нет рецептов в этой группе.");
      }
      const getFoodGroupName =
        await recipeRepository.getFoodGroupNameById(groupId);
      ctx.editMessageText(`Рецепты в группе ${getFoodGroupName}`, {
        reply_markup: {
          inline_keyboard: getRecipesFromFoodGroupKeyboard(myRecipes),
        },
      });
    }
  });
}

export async function pickRecipeFromFoodGroupAction(
  bot: Telegraf<TelegrafContext>,
) {
  bot.action(/^recipe_([a-z0-9]+)$/, async (ctx) => {
    const match = ctx.match;
    const recipeId = match[1];
    const recipe = await recipeRepository.findRecipeById(recipeId);
    if (!recipe) {
      return ctx.reply("Рецепт не найден.");
    }
    const foodGroups = await recipeRepository.findFoodGroupsByTelegramId(
      ctx.session.id!,
    );
    if (!foodGroups) {
      return await ctx.editMessageText(
        "У вас пока нет групп рецептов, пропишите /create_food_group для создания новой группы и попробуйсте снова",
        {
          reply_markup: { inline_keyboard: backToMenu() },
        },
      );
    }
    const { title, instructions } = recipe;
    const ingredients = recipe.ingredients.map((ingredient) =>
      JSON.parse(ingredient as string),
    ) as { name: string; weight: number; unit: string }[];

    ctx.editMessageText(
      `${title}\n\nИнгредиенты:\n${ingredients
        .map(
          (ingredient) =>
            `${ingredient.name}: ${ingredient.weight}${convertUnit(ingredient.unit)}`,
        )
        .join(
          "\n",
        )}\n\n*Рецепт:*\n${instructions.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
      {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: getFoodGroupKeyboard(foodGroups) },
      },
    );
  });
}
