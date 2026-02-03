import type { Telegraf } from "telegraf";
import { textEvent } from "./text.event";
import { callbackEvent } from "./callback.event";

export * from "./text.event";
export * from "./callback.event";
export function initEvents(bot: Telegraf) {
  textEvent(bot);
  callbackEvent(bot);
}
