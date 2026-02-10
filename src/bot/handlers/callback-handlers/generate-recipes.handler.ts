import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { backToMenu } from "../keyboards";
import { generateRecipeEvent } from "../text-events/generate-recipe.event";
import { saveRecipeInFoodGroup } from "./get-recipes.handler";

export async function generateRecipeHandler(ctx: TelegrafContext) {
  if (!ctx.session.products) {
    ctx.session.state = "generate_recipe";
    ctx.editMessageText("Пожалуйста, введите продукты для генерации рецепта", {
      reply_markup: { inline_keyboard: backToMenu() },
    });
  } else {
    await generateRecipeEvent(ctx, ctx.session.id!, ctx.session.products);
  }
}

export async function cancelRecipeHandler(ctx: TelegrafContext) {
  ctx.session.products = "";
  ctx.editMessageText("Пожалуйста, введите продукты для генерации рецепта", {
    reply_markup: { inline_keyboard: backToMenu() },
  });

  ctx.session.lastRecipe = "";
  ctx.session.state = "generate_recipe";
}

export async function saveRecipeHandler(ctx: TelegrafContext) {
  saveRecipeInFoodGroup(ctx);
  ctx.session.state = null;
}
