import { GoogleGenAI } from "@google/genai";
import { IGenerateRecipe } from "../../modules/chat/chat.types";
import { ENV } from "../../config/env";

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export async function chatCompletion(
  prompt: string,
): Promise<IGenerateRecipe | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    let data: string = "";
    response.text?.startsWith("```json")
      ? (data = response.text?.split("json")[1].split("```")[0] || "")
      : (data = response.text || "");

    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return null;
  }
}
