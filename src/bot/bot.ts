import { Telegraf } from "telegraf";
import { initHandlers } from "./handlers";
import { initEvents } from "./events";
import { ENV } from "../config/env";

export async function initBot() {
  const token = ENV.TELEGRAM_FULL_TOKEN;

  const bot = new Telegraf(token);

  initHandlers(bot);
  initEvents(bot);
  bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
