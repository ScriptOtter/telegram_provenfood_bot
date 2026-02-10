import { TelegrafContext } from "../interfaces/telegraf-context.interface";

export async function deleteMessages(ctx: TelegrafContext) {
  if (ctx.session.deleteMessages.length > 0) {
    ctx.deleteMessages(ctx.session.deleteMessages);
    ctx.session.deleteMessages = [];
  }
}
