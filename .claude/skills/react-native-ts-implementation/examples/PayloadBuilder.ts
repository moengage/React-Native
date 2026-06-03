// Filename: src/internal/utils/PayloadBuilder.ts
// Builds JSON strings to send to the native bridge.
// Derive payload shapes from json/hybridToNative/<contractDir>/<methodName>.json.

/**
 * Builds the base accountMeta payload (used by methods that only need appId).
 */
export function getAccountMetaPayload(appId: string): string {
    return JSON.stringify({ accountMeta: { appId } });
}

/**
 * Builds payload for <methodName>.
 * Contract: json/hybridToNative/<contractDir>/<methodName>.json
 */
export function get<MethodName>Payload(appId: string, <param>: <Type>): string {
    return JSON.stringify({
        accountMeta: { appId },
        data: { <contractField>: <param> }
    });
}
