import { recipeRepository } from "../../../modules/recipe/recipe.repository";
import { deleteMessages } from "../../../shared/utils/delete-messages.handler";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { generateRecipeEvent } from "../text-events/generate-recipe.event";
import { getFoodGroup } from "./get-recipes.handler";

export async function generateRecipeHandler(ctx: TelegrafContext) {
  if (!ctx.session.products) {
    ctx.session.state = "generate_recipe";
    await ctx
      .reply("Пожалуйста, введите продукты для генерации рецепта")
      .then(({ message_id }) => ctx.session.deleteMessages.push(message_id));
  } else {
    await generateRecipeEvent(ctx, ctx.session.id!, ctx.session.products);
  }
  await ctx.answerCbQuery("", { show_alert: false });
}

export async function cancelRecipeHandler(ctx: TelegrafContext) {
  ctx.session.products = "";
  await ctx
    .reply("Пожалуйста, введите продукты для генерации рецепта")
    .then((message) => ctx.session.deleteMessages.push(message.message_id));
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  ctx.session.lastRecipe = "";
  ctx.session.state = "generate_recipe";

  await ctx.answerCbQuery("", { show_alert: false });
}

export async function saveRecipeHandler(ctx: TelegrafContext) {
  getFoodGroup(ctx);

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  ctx.session.state = null;
}
