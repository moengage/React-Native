import {
    keyIncludedFields,
    keyItemId,
    keyRecommendationId
} from "../Constants";

function getAccountMetaPayload(appId: string) {
    return { appId: appId };
}

/**
 * Builds the payload for fetchRecommendations. `includedFields` is a set , so
 * duplicates are dropped before the payload is built.
 */
export function buildFetchRecommendationsPayload(
    appId: string,
    recommendationId: string,
    itemId: string,
    includedFields: string[]
): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            [keyRecommendationId]: recommendationId,
            [keyItemId]: itemId,
            [keyIncludedFields]: Array.from(new Set(includedFields))
        }
    };
    return JSON.stringify(payload);
}
