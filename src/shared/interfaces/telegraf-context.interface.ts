import type { Context } from "telegraf";

interface Session {
  id?: string;
  products: string;
  state:
    | null
    | "generate_recipe"
    | "confirm_recipe"
    | "create_food_group"
    | "awaiting_click";
  deleteMessages: number[];
  lastRecipe: string;
}

export interface TelegrafContext extends Context {
  session: Session;
}
