import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { backToMenu, menuKeyboard } from "../keyboards";

export async function currentSessionHandler(ctx: TelegrafContext) {
  ctx.editMessageText(JSON.stringify(ctx.session, null, 2), {
    reply_markup: { inline_keyboard: backToMenu() },
  });
}
