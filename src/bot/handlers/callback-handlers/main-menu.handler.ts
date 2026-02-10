import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";
import { getMenu } from "../keyboards";

export async function mainMenuHandler(ctx: TelegrafContext) {
  await getMenu(ctx);
}
