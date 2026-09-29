import "ts-jest";
import "jest";

jest.mock("react-native-moengage", () => ({
    MoEngageLogger: {
        verbose: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

import { parseRecommendationsFailure, parseRecommendedItems } from "../internal/utils/PayloadParser";
import RecommendationsFailure from "../model/RecommendationsFailure";
import { KNOWN_FAILURE_REASONS, RecommendationsFailureReason } from "../model/RecommendationsFailureReason";

describe("PayloadParser", () => {
    describe("parseRecommendedItems", () => {
        it("parses the nativeToHybrid contract, passing catalog attributes through as-is", () => {
            const result = parseRecommendedItems(JSON.stringify({
                accountMeta: { appId: "app_id" },
                data: {
                    items: [
                        {
                            product_id: "product_001",
                            title: "Premium Wireless Headphones",
                            price: 199.99,
                            image_link: "https://example.com/images/headphones.jpg",
                            link: "https://example.com/products/product_001"
                        },
                        { product_id: "product_002", price: 200, in_stock: true }
                    ]
                }
            }));

            expect(result.items).toHaveLength(2);
            expect(result.items[0]).toEqual({
                product_id: "product_001",
                title: "Premium Wireless Headphones",
                price: 199.99,
                image_link: "https://example.com/images/headphones.jpg",
                link: "https://example.com/products/product_001"
            });
            expect(result.items[1]).toEqual({ product_id: "product_002", price: 200, in_stock: true });
        });

        it("returns an empty result for empty items", () => {
            const result = parseRecommendedItems(JSON.stringify({ data: { items: [] } }));
            expect(result.items).toEqual([]);
        });

        it("returns an empty result when data is missing", () => {
            const result = parseRecommendedItems(JSON.stringify({ accountMeta: { appId: "app_id" } }));
            expect(result.items).toEqual([]);
        });

        it.each(["null", "[]", "42", "\"text\""])(
            "returns an empty result when the response JSON is not an object (%s)",
            (payload) => {
                expect(parseRecommendedItems(payload).items).toEqual([]);
            }
        );

        it.each([["a string", "x"], ["an object", { product_id: "p1" }], ["null", null]])(
            "returns an empty result when items is %s",
            (_, items) => {
                const result = parseRecommendedItems(JSON.stringify({ data: { items } }));
                expect(result.items).toEqual([]);
            }
        );

        it("passes the items array through as-is", () => {
            const items = [{ product_id: "p1" }, null, "p2", 3, ["p4"]];
            const result = parseRecommendedItems(JSON.stringify({ data: { items } }));
            expect(result.items).toEqual(items);
        });

        it("throws PARSE_ERROR for an invalid JSON response", () => {
            expect(() => parseRecommendedItems("not json")).toThrow(RecommendationsFailure);
            try {
                parseRecommendedItems("not json");
            } catch (error) {
                expect((error as RecommendationsFailure).failureReason)
                    .toBe(RecommendationsFailureReason.PARSE_ERROR);
            }
        });
    });

    describe("parseRecommendationsFailure", () => {
        it.each(Array.from(KNOWN_FAILURE_REASONS))(
            "reads reason %s from an iOS RECOMMENDATIONS_ERROR payload",
            (reason) => {
                const payload = JSON.stringify({
                    accountMeta: { appId: "app_id" },
                    error: { code: reason, message: "native message" }
                });
                const nativeError = Object.assign(new Error(payload), { code: "RECOMMENDATIONS_ERROR" });
                const failure = parseRecommendationsFailure(nativeError);
                expect(failure).toBeInstanceOf(RecommendationsFailure);
                expect(failure.failureReason).toBe(reason);
                expect(failure.message).toBe("native message");
            }
        );

        it("reads an iOS payload without accountMeta (missing app id)", () => {
            const payload = JSON.stringify({ error: { code: "UNKNOWN_ERROR", message: "no app id" } });
            const failure = parseRecommendationsFailure(
                Object.assign(new Error(payload), { code: "RECOMMENDATIONS_ERROR" })
            );
            expect(failure.failureReason).toBe(RecommendationsFailureReason.UNKNOWN_ERROR);
            expect(failure.message).toBe("no app id");
        });

        it("maps an unknown code inside the iOS payload to UNKNOWN_ERROR", () => {
            const payload = JSON.stringify({ error: { code: "SOMETHING_NEW", message: "m" } });
            const failure = parseRecommendationsFailure(
                Object.assign(new Error(payload), { code: "RECOMMENDATIONS_ERROR" })
            );
            expect(failure.failureReason).toBe(RecommendationsFailureReason.UNKNOWN_ERROR);
        });

        it("uses an empty message when the iOS payload has no string message", () => {
            const payload = JSON.stringify({ error: { code: "NETWORK_ERROR", message: 42 } });
            const failure = parseRecommendationsFailure(
                Object.assign(new Error(payload), { code: "RECOMMENDATIONS_ERROR" })
            );
            expect(failure.failureReason).toBe(RecommendationsFailureReason.NETWORK_ERROR);
            expect(failure.message).toBe("");
        });

        it.each([
            ["a JSON object without an error block", JSON.stringify({ detail: "x" })],
            ["a JSON object whose error is a string", JSON.stringify({ error: "boom" })],
            ["a JSON value that is not an object", "123"],
        ])("falls back to the rejection code when the message is %s", (_, message) => {
            const failure = parseRecommendationsFailure(
                Object.assign(new Error(message), { code: "RATE_LIMIT_EXCEEDED" })
            );
            expect(failure.failureReason).toBe(RecommendationsFailureReason.RATE_LIMIT_EXCEEDED);
            expect(failure.message).toBe(message);
        });

        it("reads code and message from a plain-object rejection", () => {
            const failure = parseRecommendationsFailure({ code: "SDK_STATE", message: "not initialised" });
            expect(failure.failureReason).toBe(RecommendationsFailureReason.SDK_STATE);
            expect(failure.message).toBe("not initialised");
        });

        it("uses the rejection code for an iOS PARSE_ERROR raised before the bridge", () => {
            const failure = parseRecommendationsFailure(
                Object.assign(new Error("Failed to parse incoming payload"), { code: "PARSE_ERROR" })
            );
            expect(failure.failureReason).toBe(RecommendationsFailureReason.PARSE_ERROR);
            expect(failure.message).toBe("Failed to parse incoming payload");
        });

        it.each(Array.from(KNOWN_FAILURE_REASONS))(
            "maps Android error code %s to the matching reason",
            (reason) => {
                const nativeError = Object.assign(new Error("native message"), { code: reason });
                const failure = parseRecommendationsFailure(nativeError);
                expect(failure).toBeInstanceOf(RecommendationsFailure);
                expect(failure.failureReason).toBe(reason);
                expect(failure.message).toBe("native message");
            }
        );

        it("maps an unknown native error code to UNKNOWN_ERROR", () => {
            const nativeError = Object.assign(new Error("boom"), { code: "SOMETHING_NEW" });
            expect(parseRecommendationsFailure(nativeError).failureReason)
                .toBe(RecommendationsFailureReason.UNKNOWN_ERROR);
        });

        it("maps an error without a code to UNKNOWN_ERROR", () => {
            const failure = parseRecommendationsFailure("boom");
            expect(failure.failureReason).toBe(RecommendationsFailureReason.UNKNOWN_ERROR);
            expect(failure.message).toBe("boom");
        });

        it("passes an existing RecommendationsFailure through unchanged", () => {
            const original = new RecommendationsFailure(RecommendationsFailureReason.PARSE_ERROR, "bad");
            expect(parseRecommendationsFailure(original)).toBe(original);
        });
    });

    describe("KNOWN_FAILURE_REASONS", () => {
        it("contains every RecommendationsFailureReason value", () => {
            const enumValues = Object.keys(RecommendationsFailureReason)
                .map((key) => RecommendationsFailureReason[key as keyof typeof RecommendationsFailureReason]);
            expect(Array.from(KNOWN_FAILURE_REASONS).sort()).toEqual(enumValues.sort());
        });
    });
});
