import { recipeRepository } from "../../../modules/recipe/recipe.repository";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export function generateRecipeHandler(ctx: TelegrafContext) {
  ctx.session.state = "geneate_recipe";
  ctx
    .reply("Пожалуйста, введите продукты для генерации рецепта")
    .then(({ message_id }) => ctx.session.deleteMessages.push(message_id));
}

export async function cancelRecipeHandler(ctx: TelegrafContext) {
  ctx.session.lastRecipe = "";
  ctx.session.state = "geneate_recipe";
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
}

export async function saveRecipeHandler(ctx: TelegrafContext) {
  const recipe = JSON.parse(ctx.session.lastRecipe);
  const result = await recipeRepository.createRecipe(recipe);
  if (!result) {
    ctx.reply("Ошибка при сохранении рецепта.");
    ctx.session.state = null;
  }
  ctx.answerCbQuery("Рецепт успешно сохранен!");

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  ctx.session.state = null;
  ctx.session.lastRecipe = "";
}
