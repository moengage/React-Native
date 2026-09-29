import "ts-jest";
import "jest";

// Mock the TurboModule before any imports that transitively require it.
jest.mock("../NativeMoEngageRecommendations", () => ({
    __esModule: true,
    default: {
        fetchRecommendations: jest.fn(),
    },
}));

// Stub MoEngageLogger so we don't depend on the real react-native-moengage runtime here.
jest.mock("react-native-moengage", () => ({
    MoEngageLogger: {
        verbose: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

import NativeMoEngageRecommendations from "../NativeMoEngageRecommendations";
import MoEngageRecommendationsHandler from "../internal/MoEngageRecommendationsHandler";
import RecommendationsFailure from "../model/RecommendationsFailure";
import { RecommendationsFailureReason } from "../model/RecommendationsFailureReason";

const mockNative = NativeMoEngageRecommendations as unknown as {
    fetchRecommendations: jest.Mock;
};

const APP_ID = "test_app";

describe("Handler", () => {
    let handler: MoEngageRecommendationsHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        handler = new MoEngageRecommendationsHandler(APP_ID);
    });

    describe("fetchRecommendations", () => {
        it("calls native with the built payload and parses the response (round-trip)", async () => {
            mockNative.fetchRecommendations.mockResolvedValue(JSON.stringify({
                accountMeta: { appId: APP_ID },
                data: { items: [{ product_id: "product_001", price: 199.99 }] }
            }));

            const result = await handler.fetchRecommendations("clothing", "shirts", ["size", "color"]);

            expect(mockNative.fetchRecommendations).toHaveBeenCalledTimes(1);
            const sent = JSON.parse(mockNative.fetchRecommendations.mock.calls[0]![0] as string);
            expect(sent).toEqual({
                accountMeta: { appId: APP_ID },
                data: { recommendationId: "clothing", itemId: "shirts", includedFields: ["size", "color"] }
            });
            expect(result.items).toEqual([{ product_id: "product_001", price: 199.99 }]);
        });

        it("rejects with a typed failure carrying the native reason", async () => {
            mockNative.fetchRecommendations.mockRejectedValue(
                Object.assign(new Error("Rate limit exceeded"), { code: "RATE_LIMIT_EXCEEDED" })
            );

            const promise = handler.fetchRecommendations("clothing", "", []);

            await expect(promise).rejects.toBeInstanceOf(RecommendationsFailure);
            await expect(promise).rejects.toMatchObject({
                failureReason: RecommendationsFailureReason.RATE_LIMIT_EXCEEDED,
                message: "Rate limit exceeded"
            });
        });

        it("rejects with the reason from an iOS RECOMMENDATIONS_ERROR payload", async () => {
            mockNative.fetchRecommendations.mockRejectedValue(
                Object.assign(
                    new Error(JSON.stringify({
                        accountMeta: { appId: APP_ID },
                        data: { reason: "RATE_LIMIT_EXCEEDED", message: "Rate limit exceeded" }
                    })),
                    { code: "RECOMMENDATIONS_ERROR" }
                )
            );

            await expect(handler.fetchRecommendations("clothing", "", [])).rejects.toMatchObject({
                failureReason: RecommendationsFailureReason.RATE_LIMIT_EXCEEDED,
                message: "Rate limit exceeded"
            });
        });

        it("rejects with PARSE_ERROR when the native response is not valid JSON", async () => {
            mockNative.fetchRecommendations.mockResolvedValue("not json");

            await expect(handler.fetchRecommendations("clothing", "", [])).rejects.toMatchObject({
                failureReason: RecommendationsFailureReason.PARSE_ERROR
            });
        });
    });
});
