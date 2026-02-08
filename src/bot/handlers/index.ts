import { Telegraf } from "telegraf";

import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";
import {
  foodGroupHandler,
  helpHandler,
  recipeHandler,
  startHandler,
} from "./commands";

export function initHandlers(bot: Telegraf<TelegrafContext>) {
  helpHandler(bot);
  startHandler(bot);
  recipeHandler(bot);
  foodGroupHandler(bot);
}
