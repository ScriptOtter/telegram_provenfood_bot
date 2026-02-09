import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export function helpHandler(bot: Telegraf<TelegrafContext>) {
  bot.help(async (ctx) => {
    ctx.session.deleteMessages.push(ctx.message.message_id);
    await ctx
      .reply("Привет, напиши /recipe чтобы сгенерировать рецепт")
      .then((message) => {
        ctx.session.deleteMessages.push(message.message_id);
      });
  });
}
