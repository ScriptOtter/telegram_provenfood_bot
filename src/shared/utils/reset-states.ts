import { TelegrafContext } from "../interfaces/telegraf-context.interface";

export async function resetSession(ctx: TelegrafContext) {
  ctx.session = ctx.session = {
    id: ctx.session.id,
    state: null,
    deleteMessages: [],
    products: "",
    lastRecipe: "",
  };
}
