import type { Context } from "telegraf";

interface Session {
  id?: string;
  state:
    | null
    | "geneate_recipe"
    | "confirm_recipe"
    | "create_food_group"
    | "awaiting_click";
  deleteMessages: number[];
  lastRecipe: string;
}

export interface TelegrafContext extends Context {
  session: Session;
}
