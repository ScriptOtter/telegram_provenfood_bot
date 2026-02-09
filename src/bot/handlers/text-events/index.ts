import type { Telegraf } from "telegraf";
import { generateRecipeEvent } from "./generate-recipe.event";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { createFoodGroupEvent } from "./food-group.event";

export async function initTextEvents(bot: Telegraf<TelegrafContext>) {
  bot.on("text", async (ctx) => {
    const state = ctx.session.state;
    const telegramId = String(ctx.from.id);
    const text = ctx.message.text;

    ctx.session.deleteMessages.push(ctx.message.message_id);
    const valid = validateTextEvents(state, telegramId, text);
    if (!valid) {
      await ctx
        .reply("Некорректные данные\nПропишите /start")
        .then((message) => ctx.session.deleteMessages.push(message.message_id));
      return;
    }

    switch (state) {
      case "generate_recipe":
        await generateRecipeEvent(ctx, telegramId, text);
        break;
      case "create_food_group":
        await createFoodGroupEvent(ctx, telegramId, text);
        break;
      default:
        await ctx.reply("Неизвестный запрос.");
    }
  });
}

function validateTextEvents(
  state: TelegrafContext["session"]["state"],
  telegramId: string,
  text: string,
): boolean {
  if (!telegramId) return false;
  if (!text || text.trim().length === 0) return false;
  if (!state) return false;
  return true;
}
