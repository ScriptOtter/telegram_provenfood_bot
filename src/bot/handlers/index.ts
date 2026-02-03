import { Telegraf } from "telegraf";
import { helpHandler } from "./help.handler";
import { startHandler } from "./start.handler";
import { recipeHandler } from "./recipe.handler";

export function initHandlers(bot: Telegraf) {
  helpHandler(bot);
  startHandler(bot);
  recipeHandler(bot);
}
