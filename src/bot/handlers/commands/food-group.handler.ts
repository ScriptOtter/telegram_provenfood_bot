import { Telegraf } from "telegraf";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export function foodGroupHandler(bot: Telegraf<TelegrafContext>) {
  bot.command("create_food_group", (ctx) => {
    ctx.session.state = "create_food_group";
    ctx.reply("Введите название новой группы рецептов:");
  });
}
