export function convertUnit(value) {
  const units = {
    gram: "гр",
    kilogram: "кг",
    liter: "л",
  };
  return units[value] || value;
}
