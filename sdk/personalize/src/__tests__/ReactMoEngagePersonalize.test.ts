import "ts-jest";
import "jest";

jest.mock("../internal/MoEPersonalizeHandler", () => ({
    __esModule: true,
    fetchExperiencesMeta: jest.fn(),
    fetchExperiences: jest.fn(),
    trackExperienceShown: jest.fn(),
    trackExperienceClicked: jest.fn(),
    trackOfferingShown: jest.fn(),
    trackOfferingClicked: jest.fn(),
}));

import ReactMoEngagePersonalize from "../index";
import * as Handler from "../internal/MoEPersonalizeHandler";
import ExperienceCampaign from "../model/ExperienceCampaign";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

const mockHandler = Handler as unknown as {
    fetchExperiencesMeta: jest.Mock;
    fetchExperiences: jest.Mock;
    trackExperienceShown: jest.Mock;
    trackExperienceClicked: jest.Mock;
    trackOfferingShown: jest.Mock;
    trackOfferingClicked: jest.Mock;
};

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

    it("constructor stores appId and delegates to handler with it", () => {
        mockHandler.fetchExperiencesMeta.mockResolvedValue({ source: DataSource.NETWORK, experiences: [] });
        instance.fetchExperiencesMeta([ExperienceStatus.ACTIVE]);
        expect(mockHandler.fetchExperiencesMeta).toHaveBeenCalledWith(APP_ID, [ExperienceStatus.ACTIVE]);
    });

    describe("error propagation (validates fix #1)", () => {
        it("fetchExperiencesMeta rejects when handler rejects (no silent fallback)", async () => {
            mockHandler.fetchExperiencesMeta.mockRejectedValue(new Error("SDK_NOT_INITIALIZED"));
            await expect(instance.fetchExperiencesMeta([])).rejects.toThrow("SDK_NOT_INITIALIZED");
        });

        it("fetchExperiences rejects when handler rejects (no silent fallback)", async () => {
            mockHandler.fetchExperiences.mockRejectedValue(new Error("NETWORK_ERROR"));
            await expect(instance.fetchExperiences(["k"])).rejects.toThrow("NETWORK_ERROR");
        });

        it("fetchExperience rejects when underlying fetchExperiences rejects", async () => {
            mockHandler.fetchExperiences.mockRejectedValue(new Error("FEATURE_DISABLED"));
            await expect(instance.fetchExperience("k")).rejects.toThrow("FEATURE_DISABLED");
        });
    });

    describe("fetchExperience singular (validates fix #2)", () => {
        it("delegates to fetchExperiences([key], {}) when no attributes passed", async () => {
            mockHandler.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperience("my_key");
            expect(mockHandler.fetchExperiences).toHaveBeenCalledWith(APP_ID, ["my_key"], {});
        });

        it("forwards attributes when provided", async () => {
            mockHandler.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperience("my_key", { plan: "pro" });
            expect(mockHandler.fetchExperiences).toHaveBeenCalledWith(APP_ID, ["my_key"], { plan: "pro" });
        });
    });

    describe("default attributes parameter", () => {
        it("fetchExperiences defaults attributes to {} when omitted", async () => {
            mockHandler.fetchExperiences.mockResolvedValue({ experiences: [], failures: [] });
            await instance.fetchExperiences(["k"]);
            expect(mockHandler.fetchExperiences).toHaveBeenCalledWith(APP_ID, ["k"], {});
        });
    });

    describe("tracking method delegation", () => {
        it("trackExperienceShown delegates with appId and campaigns array", () => {
            const c = [campaign("a"), campaign("b")];
            instance.trackExperienceShown(c);
            expect(mockHandler.trackExperienceShown).toHaveBeenCalledWith(APP_ID, c);
        });

        it("trackExperienceClicked delegates with appId and single campaign", () => {
            const c = campaign("x");
            instance.trackExperienceClicked(c);
            expect(mockHandler.trackExperienceClicked).toHaveBeenCalledWith(APP_ID, c);
        });

        it("trackOfferingShown delegates with appId and attributes array", () => {
            const attrs = [{ a: 1 }];
            instance.trackOfferingShown(attrs);
            expect(mockHandler.trackOfferingShown).toHaveBeenCalledWith(APP_ID, attrs);
        });

        it("trackOfferingClicked delegates with appId, campaign, and single attributes", () => {
            const c = campaign("o");
            instance.trackOfferingClicked(c, { sku: "s1" });
            expect(mockHandler.trackOfferingClicked).toHaveBeenCalledWith(APP_ID, c, { sku: "s1" });
        });
    });
});
