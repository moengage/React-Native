// Filename: src/internal/Constants.ts
export const MODULE_TAG = "MoEngageReact<featureNameCamel>_";

// One const per JSON field used in payload building/parsing:
export const keyAccountMeta = "accountMeta";
export const keyData = "data";
export const keyAppId = "appId";
export const keyPayload = "payload";
// ... add more matching contract field names

// Event method name constants (must match android Constants.kt values):
// Only add when nativeToHybrid events exist:
export const event<EventName> = "<eventMethodName>";
