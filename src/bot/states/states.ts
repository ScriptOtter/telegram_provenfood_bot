interface IStates {
  generate_recipe: boolean;
  awaiting_click: boolean;
  saved_recipes: boolean;
}

export const states: IStates = {
  generate_recipe: false,
  awaiting_click: false,
  saved_recipes: false,
};

export let deleteIds: number[] = [];

export function resetStates(states) {
  for (const key in states) {
    states[key] = false;
  }
}
