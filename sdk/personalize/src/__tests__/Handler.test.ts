import "ts-jest";
import "jest";

// Mock the TurboModule before any imports that transitively require it.
jest.mock("../NativeMoEngagePersonalize", () => ({
    __esModule: true,
    default: {
        fetchExperiencesMeta: jest.fn(),
        fetchExperiences: jest.fn(),
        trackExperienceShown: jest.fn(),
        trackExperienceClicked: jest.fn(),
        trackOfferingShown: jest.fn(),
        trackOfferingClicked: jest.fn(),
    },
}));

import NativeMoEngagePersonalize from "../NativeMoEngagePersonalize";
import * as Handler from "../internal/MoEPersonalizeHandler";
import ExperienceCampaign from "../model/ExperienceCampaign";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

const mockNative = NativeMoEngagePersonalize as unknown as {
    fetchExperiencesMeta: jest.Mock;
    fetchExperiences: jest.Mock;
    trackExperienceShown: jest.Mock;
    trackExperienceClicked: jest.Mock;
    trackOfferingShown: jest.Mock;
    trackOfferingClicked: jest.Mock;
};

const APP_ID = "test_app";

function makeCampaign(key = "k"): ExperienceCampaign {
    return new ExperienceCampaign(key, { p: 1 }, { c: "v" }, DataSource.NETWORK);
}

describe("Handler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchExperiencesMeta", () => {
        it("calls native with built payload and parses the response", async () => {
            mockNative.fetchExperiencesMeta.mockResolvedValue(JSON.stringify({
                accountMeta: { appId: APP_ID },
                data: {
                    source: "NETWORK",
                    experiences: [{ experienceKey: "k", experienceName: "n", status: "active" }]
                }
            }));

            const result = await Handler.fetchExperiencesMeta(APP_ID, [ExperienceStatus.ACTIVE]);

            expect(mockNative.fetchExperiencesMeta).toHaveBeenCalledTimes(1);
            const sent = JSON.parse(mockNative.fetchExperiencesMeta.mock.calls[0]![0] as string);
            expect(sent).toEqual({
                accountMeta: { appId: APP_ID },
                data: { status: ["active"] }
            });
            expect(result.source).toBe(DataSource.NETWORK);
            expect(result.experiences).toHaveLength(1);
        });

        it("bubbles up native rejections (validates fix #1)", async () => {
            mockNative.fetchExperiencesMeta.mockRejectedValue(new Error("SDK_NOT_INITIALIZED"));
            await expect(Handler.fetchExperiencesMeta(APP_ID, [])).rejects.toThrow("SDK_NOT_INITIALIZED");
        });
    });

    describe("fetchExperiences", () => {
        it("calls native with built payload and parses the response", async () => {
            mockNative.fetchExperiences.mockResolvedValue(JSON.stringify({
                accountMeta: { appId: APP_ID },
                data: {
                    experiences: [{ experienceKey: "k", payload: {}, experienceContext: {}, source: "NETWORK" }],
                    failures: []
                }
            }));

            const result = await Handler.fetchExperiences(APP_ID, ["k"], { a: "b" });

            const sent = JSON.parse(mockNative.fetchExperiences.mock.calls[0]![0] as string);
            expect(sent).toEqual({
                accountMeta: { appId: APP_ID },
                data: { experienceKeys: ["k"], attributes: { a: "b" } }
            });
            expect(result.experiences).toHaveLength(1);
        });

        it("bubbles up native rejections (validates fix #1)", async () => {
            mockNative.fetchExperiences.mockRejectedValue(new Error("NETWORK_ERROR"));
            await expect(Handler.fetchExperiences(APP_ID, ["k"], {})).rejects.toThrow("NETWORK_ERROR");
        });
    });

    describe("tracking methods", () => {
        it("trackExperienceShown sends array under 'experiences'", () => {
            Handler.trackExperienceShown(APP_ID, [makeCampaign("a"), makeCampaign("b")]);
            const sent = JSON.parse(mockNative.trackExperienceShown.mock.calls[0]![0] as string);
            expect(sent.data.experiences).toHaveLength(2);
            expect(sent.data.experiences[0].experienceKey).toBe("a");
        });

        it("trackExperienceClicked sends single 'experience' object", () => {
            Handler.trackExperienceClicked(APP_ID, makeCampaign("x"));
            const sent = JSON.parse(mockNative.trackExperienceClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("x");
            expect(sent.data).not.toHaveProperty("experiences");
        });

        it("trackOfferingShown sends array of offeringAttributes", () => {
            Handler.trackOfferingShown(APP_ID, [{ a: 1 }]);
            const sent = JSON.parse(mockNative.trackOfferingShown.mock.calls[0]![0] as string);
            expect(sent.data.offeringAttributes).toEqual([{ a: 1 }]);
        });

        it("trackOfferingClicked sends single experience + single offeringAttributes object", () => {
            Handler.trackOfferingClicked(APP_ID, makeCampaign("o"), { sku: "s1" });
            const sent = JSON.parse(mockNative.trackOfferingClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("o");
            expect(sent.data.offeringAttributes).toEqual({ sku: "s1" });
        });
    });
});
