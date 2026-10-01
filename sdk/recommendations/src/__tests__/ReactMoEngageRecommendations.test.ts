import "ts-jest";
import "jest";

const mockHandlerInstance = {
    fetchRecommendations: jest.fn(),
};

jest.mock("../internal/MoEngageRecommendationsHandler", () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockHandlerInstance),
}));

jest.mock("react-native-moengage", () => ({
    MoEngageLogger: {
        verbose: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

import ReactMoEngageRecommendations, { RecommendedItems } from "../index";
import MoEngageRecommendationsHandler from "../internal/MoEngageRecommendationsHandler";

const APP_ID = "app_123";

describe("ReactMoEngageRecommendations", () => {
    let instance: ReactMoEngageRecommendations;

    beforeEach(() => {
        jest.clearAllMocks();
        instance = new ReactMoEngageRecommendations(APP_ID);
    });

    it("scopes the handler to the app id", () => {
        expect(MoEngageRecommendationsHandler).toHaveBeenCalledWith(APP_ID);
    });

    it("delegates fetchRecommendations with all arguments", async () => {
        const items = new RecommendedItems([{ product_id: "p1" }]);
        mockHandlerInstance.fetchRecommendations.mockResolvedValue(items);

        await expect(instance.fetchRecommendations("clothing", "shirts", ["size"])).resolves.toBe(items);
        expect(mockHandlerInstance.fetchRecommendations).toHaveBeenCalledWith("clothing", "shirts", ["size"]);
    });

    it("defaults itemId and includedFields to empty values", async () => {
        mockHandlerInstance.fetchRecommendations.mockResolvedValue(new RecommendedItems([]));

        await instance.fetchRecommendations("clothing");
        expect(mockHandlerInstance.fetchRecommendations).toHaveBeenCalledWith("clothing", "", []);
    });
});
