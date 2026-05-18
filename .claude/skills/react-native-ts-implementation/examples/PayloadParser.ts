// Filename: src/internal/utils/PayloadParser.ts
// Extracts typed values from the raw JSON strings returned by native bridge methods.
// Derive data shapes from json/nativeToHybrid/<contractDir>/<methodName>.json.
import { get<ModelClass>FromJson } from './JsonToModelMapper';

/**
 * Parses native response for <methodName>.
 * Contract: json/nativeToHybrid/<contractDir>/<methodName>.json
 */
export function get<Entity>FromPayload(payload: string): <ReturnType> | null {
    try {
        const json = JSON.parse(payload);
        const data = json["data"];
        if (data === undefined || data === null) return null;
        return get<ModelClass>FromJson(data["<contractField>"]);
    } catch (error) {
        return null;
    }
}
