import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

import { mainKeyboard } from "../keyboards";

export async function startEvent(bot: Telegraf<TelegrafContext>) {
  bot.hears("Начать", async (ctx) => {
    await ctx.session.deleteMessages.push(ctx.message.message_id);
    await mainKeyboard(ctx);
  });
}
