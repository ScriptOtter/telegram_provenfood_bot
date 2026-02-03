interface IStates {
  generate_recipe: boolean;
  saved_recipes: boolean;
}

export const states: IStates = {
  generate_recipe: false,
  saved_recipes: false,
};

export let deleteIds: number[] = [];

export function resetStates(states) {
  for (const key in states) {
    states[key] = false;
  }
}
