import { Telegraf } from "telegraf";
import {
  cancelRecipeHandler,
  generateRecipeHandler,
  saveRecipeHandler,
} from "./generate-recipes.handler";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { currentSessionHandler } from "./current-session";
import { getFoodGroup } from "./get-recipes.handler";

export async function initCallbackHandlers(bot: Telegraf<TelegrafContext>) {
  bot.on("callback_query", async (ctx) => {
    if (!("data" in ctx.callbackQuery)) {
      console.log(
        "Callback query does not contain 'data' field:",
        ctx.callbackQuery,
      );
      return;
    }
    const callbackData = ctx.callbackQuery.data;

    switch (callbackData) {
      case "generate_recipe":
        await generateRecipeHandler(ctx);
        break;
      case "save_recipe":
        await saveRecipeHandler(ctx);
        break;
      case "cancel_recipe":
        await cancelRecipeHandler(ctx);
        break;
      case "get_food_groups":
        await getFoodGroup(ctx);
        break;
      case "current_session":
        await currentSessionHandler(ctx);
        break;
      default:
        await ctx.answerCbQuery("Неизвестный запрос.");
    }
  });
}
