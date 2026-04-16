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

import NativeMoEngagePersonalize from "../NativeMoEngagePersonalize";
import MoEngagePersonalizeHandler from "../internal/MoEngagePersonalizeHandler";
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
    let handler: MoEngagePersonalizeHandler;

    beforeEach(() => {
        jest.clearAllMocks();
        handler = new MoEngagePersonalizeHandler(APP_ID);
    });

    describe("fetchExperiencesMeta", () => {
        it("calls native with built payload and parses the response (round-trip)", async () => {
            mockNative.fetchExperiencesMeta.mockResolvedValue(JSON.stringify({
                accountMeta: { appId: APP_ID },
                data: {
                    source: "NETWORK",
                    experiences: [{ experienceKey: "k", experienceName: "n", status: "active" }]
                }
            }));

            const result = await handler.fetchExperiencesMeta([ExperienceStatus.ACTIVE]);

            expect(mockNative.fetchExperiencesMeta).toHaveBeenCalledTimes(1);
            const sent = JSON.parse(mockNative.fetchExperiencesMeta.mock.calls[0]![0] as string);
            expect(sent).toEqual({
                accountMeta: { appId: APP_ID },
                data: { status: ["active"] }
            });
            expect(result.source).toBe(DataSource.NETWORK);
            expect(result.experiences).toHaveLength(1);
            // Deep field round-trip — catches a parser that drops fields
            expect(result.experiences[0]!.experienceKey).toBe("k");
            expect(result.experiences[0]!.experienceName).toBe("n");
            expect(result.experiences[0]!.status).toBe(ExperienceStatus.ACTIVE);
        });

        it("bubbles up native rejections", async () => {
            mockNative.fetchExperiencesMeta.mockRejectedValue(new Error("SDK_NOT_INITIALIZED"));
            await expect(handler.fetchExperiencesMeta([])).rejects.toThrow("SDK_NOT_INITIALIZED");
        });
    });

    describe("fetchExperiences", () => {
        it("calls native with built payload and parses the response (round-trip)", async () => {
            mockNative.fetchExperiences.mockResolvedValue(JSON.stringify({
                accountMeta: { appId: APP_ID },
                data: {
                    experiences: [{
                        experienceKey: "k",
                        payload: { color: "blue" },
                        experienceContext: { audience: "premium" },
                        source: "NETWORK"
                    }],
                    failures: [{ reason: "EXPERIENCE_EXPIRED", experienceKeys: ["x", "y"] }]
                }
            }));

            const result = await handler.fetchExperiences(["k"], { a: "b" });

            const sent = JSON.parse(mockNative.fetchExperiences.mock.calls[0]![0] as string);
            expect(sent).toEqual({
                accountMeta: { appId: APP_ID },
                data: { experienceKeys: ["k"], attributes: { a: "b" } }
            });
            // Deep field round-trip on experiences
            expect(result.experiences).toHaveLength(1);
            const e = result.experiences[0]!;
            expect(e.experienceKey).toBe("k");
            expect(e.payload).toEqual({ color: "blue" });
            expect(e.experienceContext).toEqual({ audience: "premium" });
            expect(e.source).toBe(DataSource.NETWORK);
            // Deep field round-trip on failures
            expect(result.failures).toHaveLength(1);
            expect(result.failures[0]!.reason).toBe("EXPERIENCE_EXPIRED");
            expect(result.failures[0]!.experienceKeys).toEqual(["x", "y"]);
        });

        it("bubbles up native rejections", async () => {
            mockNative.fetchExperiences.mockRejectedValue(new Error("NETWORK_ERROR"));
            await expect(handler.fetchExperiences(["k"], {})).rejects.toThrow("NETWORK_ERROR");
        });
    });

    describe("tracking methods", () => {
        it("trackExperienceShown sends array under 'experiences'", () => {
            handler.trackExperienceShown([makeCampaign("a"), makeCampaign("b")]);
            const sent = JSON.parse(mockNative.trackExperienceShown.mock.calls[0]![0] as string);
            expect(sent.data.experiences).toHaveLength(2);
            expect(sent.data.experiences[0].experienceKey).toBe("a");
        });

        it("trackExperienceClicked sends single 'experience' object", () => {
            handler.trackExperienceClicked(makeCampaign("x"));
            const sent = JSON.parse(mockNative.trackExperienceClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("x");
            expect(sent.data).not.toHaveProperty("experiences");
        });

        it("trackOfferingShown sends array of offeringAttributes", () => {
            handler.trackOfferingShown([{ a: 1 }]);
            const sent = JSON.parse(mockNative.trackOfferingShown.mock.calls[0]![0] as string);
            expect(sent.data.offeringAttributes).toEqual([{ a: 1 }]);
        });

        it("trackOfferingClicked sends single experience + single offeringAttributes object", () => {
            handler.trackOfferingClicked(makeCampaign("o"), { sku: "s1" });
            const sent = JSON.parse(mockNative.trackOfferingClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("o");
            expect(sent.data.offeringAttributes).toEqual({ sku: "s1" });
        });
    });
});
