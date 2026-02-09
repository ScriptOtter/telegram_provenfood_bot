import { Telegraf, session } from "telegraf";

import { ENV } from "../config/env";
import { TelegrafContext } from "../shared/interfaces/telegraf-context.interface";
import { initCallbackHandlers } from "./handlers/callback-handlers";
import { initTextEvents } from "./handlers/text-events";
import { initCommands } from "./handlers/commands";
import { startEvent } from "./handlers/text-events/start.event";

export async function createBot() {
  const token = ENV.TELEGRAM_FULL_TOKEN;

  const bot = new Telegraf<TelegrafContext>(token);
  bot.use(session());

  bot.use((ctx, next) => {
    if (!ctx.session) {
      ctx.session = {
        id: String(ctx.from?.id) || "",
        state: null,
        deleteMessages: [],
        products: "",
        lastRecipe: "",
      };
    }
    return next();
  });
  await startEvent(bot);
  await initCommands(bot);
  await initTextEvents(bot);
  await initCallbackHandlers(bot);

  return bot;
}
