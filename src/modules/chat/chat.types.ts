interface Ingredients {
  name: string;
  weight: number;
  unit: "gram" | "kilogram" | "liter";
}

export interface IGenerateRecipe {
  title: string;
  ingredients: Ingredients[];
  reciept: string[];
}

export const recipeSchema = `
interface IGenerateRecipe {
  title: string;
  ingredients[]: {
    name: string;
    weight: number;
    unit: "gram" | "kilogram" | "liter";
  };
  reciept: string[];
}
`;
