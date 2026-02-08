import { Markup } from "telegraf";

export function keyboardSaveRecipe() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Сохранить", "save_recipe"),
  ]);
}
