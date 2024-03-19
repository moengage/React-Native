export function isValidObject(value: any) {
  return typeof value === "object" && Object.keys(value).length > 0;
}

export function isValidString(value: any): Boolean {
  return typeof value === "string";
}

export function isValidNumber(value: any): Boolean {
  return typeof value === "number";
}

export function isValidBoolean(value: any): Boolean {
  return typeof value === "boolean";
}