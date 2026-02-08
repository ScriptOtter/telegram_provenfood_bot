import type { Telegraf } from "telegraf";
import { textEvent } from "./text.event";

import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";

export * from "./text.event";

export function initEvents(bot: Telegraf<TelegrafContext>) {
  textEvent(bot);
}
