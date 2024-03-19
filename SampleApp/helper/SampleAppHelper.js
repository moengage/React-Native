export function validateArrayOfString(data) {
  if (!Array.isArray(data) || data.length == 0) {
    return false;
  }
  if (!data.every(validateString)) {
    return false;
  }
  return true;
}

function validateString(value) {
  return typeof value === "string";
}
