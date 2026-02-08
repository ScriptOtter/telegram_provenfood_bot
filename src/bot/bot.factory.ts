import { Telegraf, session } from "telegraf";
import { initHandlers } from "./handlers";
import { initEvents } from "./events";
import { ENV } from "../config/env";
import { TelegrafContext } from "../shared/interfaces/telegraf-context.interface";
import { initCallbackHandlers } from "./handlers/callback-handlers";

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
        lastRecipe: "",
      };
    }
    return next();
  });
  initHandlers(bot);
  initEvents(bot);
  initCallbackHandlers(bot);

  return bot;
}
