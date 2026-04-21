import "ts-jest";
import "jest";

const mockHandlerInstance = {
    fetchExperiencesMeta: jest.fn(),
    fetchExperiences: jest.fn(),
    experiencesShown: jest.fn(),
    experienceClicked: jest.fn(),
    offeringsShown: jest.fn(),
    offeringClicked: jest.fn(),
};

jest.mock("../internal/MoEngagePersonalizeHandler", () => ({
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

import ReactMoEngagePersonalize from "../index";
import ExperienceCampaign from "../model/ExperienceCampaign";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

const APP_ID = "app_123";

function campaign(key = "k"): ExperienceCampaign {
    return new ExperienceCampaign(key, {}, {}, DataSource.NETWORK);
}

describe("ReactMoEngagePersonalize", () => {
    let instance: ReactMoEngagePersonalize;

    beforeEach(() => {
        jest.clearAllMocks();
        instance = new ReactMoEngagePersonalize(APP_ID);
    });

    it("constructor delegates to handler", () => {
        mockHandlerInstance.fetchExperiencesMeta.mockResolvedValue({ source: DataSource.NETWORK, experiences: [] });
        instance.fetchExperiencesMeta([ExperienceStatus.ACTIVE]);
        expect(mockHandlerInstance.fetchExperiencesMeta).toHaveBeenCalledWith([ExperienceStatus.ACTIVE]);
    });

    describe("error propagation", () => {
        it("fetchExperiencesMeta rejects when handler rejects (no silent fallback)", async () => {
            mockHandlerInstance.fetchExperiencesMeta.mockRejectedValue(new Error("SDK_NOT_INITIALIZED"));
            await expect(instance.fetchExperiencesMeta([])).rejects.toThrow("SDK_NOT_INITIALIZED");
        });

        it("fetchExperiences rejects when handler rejects (no silent fallback)", async () => {
            mockHandlerInstance.fetchExperiences.mockRejectedValue(new Error("NETWORK_ERROR"));
            await expect(instance.fetchExperiences(["k"])).rejects.toThrow("NETWORK_ERROR");
        });

        it("fetchExperience rejects when underlying fetchExperiences rejects", async () => {
            mockHandlerInstance.fetchExperiences.mockRejectedValue(new Error("FEATURE_DISABLED"));
            await expect(instance.fetchExperience("k")).rejects.toThrow("FEATURE_DISABLED");
        });
    });

    describe("fetchExperience singular", () => {
        it("delegates to fetchExperiences([key], {}) when no attributes passed", async () => {
            mockHandlerInstance.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperience("my_key");
            expect(mockHandlerInstance.fetchExperiences).toHaveBeenCalledWith(["my_key"], {});
        });

        it("forwards attributes when provided", async () => {
            mockHandlerInstance.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperience("my_key", { plan: "pro" });
            expect(mockHandlerInstance.fetchExperiences).toHaveBeenCalledWith(["my_key"], { plan: "pro" });
        });
    });

    describe("default attributes parameter", () => {
        it("fetchExperiences defaults attributes to {} when omitted", async () => {
            mockHandlerInstance.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperiences(["k"]);
            expect(mockHandlerInstance.fetchExperiences).toHaveBeenCalledWith(["k"], {});
        });

        it("fetchExperiences forwards attributes when provided", async () => {
            mockHandlerInstance.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperiences(["k1", "k2"], { plan: "pro", region: "in" });
            expect(mockHandlerInstance.fetchExperiences).toHaveBeenCalledWith(
                ["k1", "k2"], { plan: "pro", region: "in" }
            );
        });
    });

    describe("return-value plumbing", () => {
        it("fetchExperiencesMeta returns the handler result", async () => {
            const expected = { source: DataSource.NETWORK, experiences: [] };
            mockHandlerInstance.fetchExperiencesMeta.mockResolvedValue(expected);
            await expect(instance.fetchExperiencesMeta([])).resolves.toBe(expected);
        });

        it("fetchExperiences returns the handler result", async () => {
            const expected = { experiences: [], failures: [] };
            mockHandlerInstance.fetchExperiences.mockResolvedValue(expected);
            await expect(instance.fetchExperiences(["k"])).resolves.toBe(expected);
        });

        it("fetchExperience returns the handler result", async () => {
            const expected = { experiences: [], failures: [] };
            mockHandlerInstance.fetchExperiences.mockResolvedValue(expected);
            await expect(instance.fetchExperience("k")).resolves.toBe(expected);
        });
    });

    describe("tracking method delegation", () => {
        it("experiencesShown delegates with campaigns array", () => {
            const c = [campaign("a"), campaign("b")];
            instance.experiencesShown(c);
            expect(mockHandlerInstance.experiencesShown).toHaveBeenCalledWith(c);
        });

        it("experienceClicked delegates with single campaign", () => {
            const c = campaign("x");
            instance.experienceClicked(c);
            expect(mockHandlerInstance.experienceClicked).toHaveBeenCalledWith(c);
        });

        it("offeringsShown delegates with offeringPayloads array", () => {
            const payloads = [{ a: 1 }];
            instance.offeringsShown(payloads);
            expect(mockHandlerInstance.offeringsShown).toHaveBeenCalledWith(payloads);
        });

        it("offeringClicked delegates with campaign and single offeringPayload", () => {
            const c = campaign("o");
            instance.offeringClicked(c, { sku: "s1" });
            expect(mockHandlerInstance.offeringClicked).toHaveBeenCalledWith(c, { sku: "s1" });
        });
    });
});
