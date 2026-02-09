import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { deleteMessages } from "../../../shared/utils/delete-messages.handler";

export function clearHandler(bot: Telegraf<TelegrafContext>) {
  bot.command("clear", async (ctx) => {
    ctx.session.deleteMessages.push(ctx.message.message_id);
    await deleteMessages(ctx);
  });
}
