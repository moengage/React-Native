import { MoEAppStatus } from "../models/MoEAppStatus";

export function validateArrayOfString(data: Array<String>) {
  if (!Array.isArray(data) || data.length == 0) {
    return false;
  }
  if (!data.every(isValidString)) {
    return false;
  }
  return true;
}

export function createUserAttributeParam(
  name: String,
  value: Object,
  type: String
): Object {
  return {
    attributeName: name,
    attributeValue: value,
    type: type,
  };
}

export function createUserLocationAttributeParam(
  name: String,
  latitude: Number,
  longitude: Number
): Object {
  return {
    attributeName: name,
    type: "location",
    locationAttribute: {
      latitude: latitude,
      longitude: longitude,
    },
  };
}

export function appStatusToString(status: MoEAppStatus): String {
  return status == MoEAppStatus.Install ? "INSTALL" : "UPDATE";
}
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