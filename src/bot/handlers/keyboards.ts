import { Markup } from "telegraf";

export const keyboardSaveRecipe = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback("Сохранить", "save_recipe"),
  ]);
};
