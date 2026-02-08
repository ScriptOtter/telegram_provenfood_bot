import { prismaService } from "../../../infrastructure/prisma/prisma.client";
import { TelegrafContext } from "../../../shared/interfaces/telegraf-context.interface";

export async function getFoodGroup(ctx: TelegrafContext) {
  const ownerId = ctx.session.id;
  if (!ownerId) {
    ctx.reply("Ошибка: не удалось определить ID пользователя.");
    return;
  }
  const foodGroups = await prismaService.foodGroup.findMany({
    where: { ownerId },
  });
  if (foodGroups.length === 0) {
    ctx.reply(
      "У вас пока нет групп рецептов, нажмите /create_food_group для создания новой группы.",
    );
    return;
  }
  ctx.reply(`Ваши группы рецептов:`, {
    reply_markup: {
      inline_keyboard: foodGroups.map((fg) => [
        { text: fg.name, callback_data: `food_group_${fg.id}` },
      ]),
    },
  });
}
