import RecommendedItems from "../../model/RecommendedItems";
import RecommendationsFailure from "../../model/RecommendationsFailure";
import {
    RecommendationsFailureReason,
    recommendationsFailureReasonFromString
} from "../../model/RecommendationsFailureReason";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG, keyCode, keyData, keyError, keyItems, keyMessage } from "../Constants";

const TAG = `${MODULE_TAG}PayloadParser`;

function isRecord(value: unknown): value is Record<string, unknown> {
    return value != null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Parses the fetchRecommendations response.
 *
 * @throws {@link RecommendationsFailure} with `PARSE_ERROR` when the response is not valid JSON.
 */
export function parseRecommendedItems(payload: string): RecommendedItems {
    MoEngageLogger.verbose(`${TAG} parseRecommendedItems() : ${payload}`);
    let json: unknown;
    try {
        json = JSON.parse(payload);
    } catch (error) {
        throw new RecommendationsFailure(RecommendationsFailureReason.PARSE_ERROR, `${error}`);
    }

    const data = isRecord(json) ? json[keyData] : undefined;
    if (!isRecord(data)) {
        MoEngageLogger.warn(`${TAG} parseRecommendedItems() : missing or invalid 'data' key, returning empty result`);
        return new RecommendedItems([]);
    }

    const items = data[keyItems];
    return new RecommendedItems(Array.isArray(items) ? items : []);
}

/**
 * Reads the `error` block of a stringified failure payload
 * (`{ accountMeta, error: { code, message } }`), or `undefined` if `message` is not one.
 */
function parseErrorPayload(message: string): Record<string, unknown> | undefined {
    try {
        const json: unknown = JSON.parse(message);
        const error = isRecord(json) ? json[keyError] : undefined;
        return isRecord(error) ? error : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Converts an error raised while fetching into a {@link RecommendationsFailure}.
 *
 * - iOS rejects with `RECOMMENDATIONS_ERROR` and the stringified failure payload as the message;
 *   the reason and message are read from its `error` block.
 * - Android, and iOS failures raised before the plugin bridge (e.g. `PARSE_ERROR`), reject with
 *   the failure reason as the error `code`.
 */
export function parseRecommendationsFailure(error: unknown): RecommendationsFailure {
    if (error instanceof RecommendationsFailure) {
        return error;
    }
    const code = isRecord(error) ? error[keyCode] : undefined;
    const message = error instanceof Error
        ? error.message
        : (isRecord(error) && typeof error[keyMessage] === "string" ? error[keyMessage] as string : `${error}`);

    const errorPayload = parseErrorPayload(message);
    if (errorPayload != null) {
        const payloadMessage = errorPayload[keyMessage];
        return new RecommendationsFailure(
            recommendationsFailureReasonFromString(errorPayload[keyCode]),
            typeof payloadMessage === "string" ? payloadMessage : ""
        );
    }
    return new RecommendationsFailure(recommendationsFailureReasonFromString(code), message);
}
