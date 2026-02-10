import { recipeRepository } from "../../../modules/recipe/recipe.repository";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { getFoodGroup } from "../callback-handlers/get-recipes.handler";
import { getMenu } from "../keyboards";
export async function createFoodGroupEvent(
  ctx: TelegrafContext,
  telegramId: string,
  text: string,
) {
  const data = { name: text.trim(), ownerId: telegramId };
  await recipeRepository.createFoodGroup(data);
  await ctx.reply(`Группа ${text} создана!`);

  ctx.session.state = null;
}
