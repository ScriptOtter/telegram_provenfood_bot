import { Telegraf } from "telegraf";
import { prismaService } from "../../../infrastructure/prisma/prisma.client";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { recipeRepository } from "../../../modules/recipe/recipe.repository";

export async function getFoodGroup(ctx: TelegrafContext) {
  const ownerId = ctx.session.id;
  if (!ownerId) {
    await ctx
      .reply("Ошибка: не удалось определить ID пользователя.")
      .then((message) => ctx.session.deleteMessages.push(message.message_id));
    return;
  }
  const foodGroups = await prismaService.foodGroup.findMany({
    where: { ownerId },
  });
  if (foodGroups.length === 0) {
    await ctx
      .reply(
        "У вас пока нет групп рецептов, нажмите /create_food_group для создания новой группы.",
      )
      .then((message) => ctx.session.deleteMessages.push(message.message_id));
    return;
  }
  await ctx
    .reply(`Ваши группы рецептов:\nСоздать новую группу /create_food_group`, {
      reply_markup: {
        inline_keyboard: foodGroups.map((fg) => [
          { text: fg.name, callback_data: `food_group_${fg.id}` },
        ]),
      },
    })
    .then((message) => ctx.session.deleteMessages.push(message.message_id));
}

export async function saveRecipeInGroup(bot: Telegraf<TelegrafContext>) {
  bot.action(/^food_group_(\d+)$/, async (ctx) => {
    console.log(
      "Received callback for food group:",
      ctx.match,
      ctx.session.lastRecipe,
    );
    const match = ctx.match;
    const groupId = match[1];
    if (ctx.session.lastRecipe) {
      const recipe = JSON.parse(ctx.session.lastRecipe);
      const userId = ctx.session.id;
      await ctx.reply(`Рецепт ${recipe.title} успешно сохранен`);

      await recipeRepository.createRecipe({ ...recipe, userId, groupId });
    } else {
      ctx.reply(`Вы нажали на ${groupId}`);
    }
  });
}
