import "ts-jest";
import "jest";

import { buildFetchRecommendationsPayload } from "../internal/utils/PayloadBuilder";

describe("PayloadBuilder", () => {
    it("builds the hybridToNative fetchRecommendations contract", () => {
        const payload = JSON.parse(
            buildFetchRecommendationsPayload("app_id", "clothing", "shirts", ["size", "color"])
        );
        expect(payload).toEqual({
            accountMeta: { appId: "app_id" },
            data: {
                recommendationId: "clothing",
                itemId: "shirts",
                includedFields: ["size", "color"]
            }
        });
    });

    it("drops duplicate included fields", () => {
        const payload = JSON.parse(
            buildFetchRecommendationsPayload("app_id", "clothing", "", ["size", "size", "color"])
        );
        expect(payload.data.includedFields).toEqual(["size", "color"]);
    });

    it("passes blank optional values through for native to ignore", () => {
        const payload = JSON.parse(buildFetchRecommendationsPayload("app_id", "clothing", "", []));
        expect(payload.data).toEqual({ recommendationId: "clothing", itemId: "", includedFields: [] });
    });
});
