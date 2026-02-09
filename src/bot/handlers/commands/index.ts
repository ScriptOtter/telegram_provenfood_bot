import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { foodGroupHandler } from "./food-group.handler";
import { startHandler } from "./start.handler";
import { helpHandler } from "./help.handler";
import { clearHandler } from "./clear.handler";

export async function initCommands(bot: Telegraf<TelegrafContext>) {
  await helpHandler(bot);
  await startHandler(bot);
  await clearHandler(bot);
  await foodGroupHandler(bot);
}
