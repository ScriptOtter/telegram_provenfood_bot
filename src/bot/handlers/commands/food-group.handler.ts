import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export function foodGroupHandler(bot: Telegraf<TelegrafContext>) {
  bot.command("create_food_group", async (ctx) => {
    ctx.session.deleteMessages.push(ctx.message.message_id);
    ctx.session.state = "create_food_group";
    await ctx
      .reply("Введите название новой группы рецептов:")
      .then((message) => ctx.session.deleteMessages.push(message.message_id));
  });
}
