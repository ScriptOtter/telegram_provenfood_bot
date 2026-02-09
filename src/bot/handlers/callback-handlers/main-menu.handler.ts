import { deleteMessages } from "../../../shared/utils/delete-messages.handler";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { mainKeyboard } from "../keyboards";

export async function mainMenuHandler(ctx: TelegrafContext) {
  await deleteMessages(ctx);
  await mainKeyboard(ctx);
}
