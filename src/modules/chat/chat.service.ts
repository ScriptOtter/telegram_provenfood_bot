import { chatCompletion } from "../../infrastructure/gemini/gemini.client";
import { IGenerateRecipe, recipeSchema } from "./chat.types";

export async function askGenerateRecipe(
  question: string,
): Promise<IGenerateRecipe | null> {
  const prompt = `
Привет, сгенерируй мне рецепт из: ${question} .
Начни писать сразу с названия рецепта. Не разделяй ингридиенты запятой. 
Вес ингредиента нужно указывать в граммах, килограммах или литрах 
Ответ дай в формате JSON по следующей схеме ${recipeSchema}
`;

  return chatCompletion(prompt);
}
