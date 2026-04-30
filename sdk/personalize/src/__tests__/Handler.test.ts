import "ts-jest";
import "jest";

// Mock the TurboModule before any imports that transitively require it.
jest.mock("../NativeMoEngagePersonalize", () => ({
    __esModule: true,
    default: {
        fetchExperiencesMeta: jest.fn(),
        fetchExperiences: jest.fn(),
        experiencesShown: jest.fn(),
        experienceClicked: jest.fn(),
        offeringsShown: jest.fn(),
        offeringClicked: jest.fn(),
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
    experiencesShown: jest.Mock;
    experienceClicked: jest.Mock;
    offeringsShown: jest.Mock;
    offeringClicked: jest.Mock;
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
        it("experiencesShown sends array under 'experiences'", () => {
            handler.experiencesShown([makeCampaign("a"), makeCampaign("b")]);
            const sent = JSON.parse(mockNative.experiencesShown.mock.calls[0]![0] as string);
            expect(sent.data.experiences).toHaveLength(2);
            expect(sent.data.experiences[0].experienceKey).toBe("a");
        });

        it("experienceClicked sends single 'experience' object", () => {
            handler.experienceClicked(makeCampaign("x"));
            const sent = JSON.parse(mockNative.experienceClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("x");
            expect(sent.data).not.toHaveProperty("experiences");
        });

        it("offeringsShown sends array of offeringPayloads", () => {
            handler.offeringsShown([{ a: 1 }]);
            const sent = JSON.parse(mockNative.offeringsShown.mock.calls[0]![0] as string);
            expect(sent.data.offeringPayloads).toEqual([{ a: 1 }]);
        });

        it("offeringClicked sends single experience + single offeringPayload object", () => {
            handler.offeringClicked(makeCampaign("o"), { sku: "s1" });
            const sent = JSON.parse(mockNative.offeringClicked.mock.calls[0]![0] as string);
            expect(sent.data.experience.experienceKey).toBe("o");
            expect(sent.data.offeringPayload).toEqual({ sku: "s1" });
        });

        // Regression guards for the "plural API drops items past the first" bug:
        // every campaign / offering passed to the plural APIs must reach the wire.
        it("experiencesShown preserves ALL N campaigns on the wire (no dropping)", () => {
            const campaigns = [makeCampaign("a"), makeCampaign("b"), makeCampaign("c")];
            handler.experiencesShown(campaigns);

            const sent = JSON.parse(mockNative.experiencesShown.mock.calls[0]![0] as string);
            expect(sent.data.experiences).toHaveLength(3);
            expect(sent.data.experiences.map((e: any) => e.experienceKey)).toEqual(["a", "b", "c"]);
        });

        it("offeringsShown preserves ALL N offering payloads on the wire (no dropping)", () => {
            const offerings = [{ offer_id: "o_0" }, { offer_id: "o_1" }, { offer_id: "o_2" }];
            handler.offeringsShown(offerings);

            const sent = JSON.parse(mockNative.offeringsShown.mock.calls[0]![0] as string);
            expect(sent.data.offeringPayloads).toHaveLength(3);
            expect(sent.data.offeringPayloads.map((o: any) => o.offer_id)).toEqual(["o_0", "o_1", "o_2"]);
        });
    });
});
