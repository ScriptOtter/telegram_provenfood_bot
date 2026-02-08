import { TelegrafContext } from "../../shared/interfaces/telegraf-context.interface";

export async function deleteMessages(ctx: TelegrafContext) {
  ctx.deleteMessages(ctx.session.deleteMessages);
  ctx.session.deleteMessages = [];
}
