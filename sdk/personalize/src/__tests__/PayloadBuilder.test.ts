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

import * as PayloadBuilder from "../internal/utils/PayloadBuilder";
import ExperienceCampaign from "../model/ExperienceCampaign";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

const APP_ID = "test_app_id";

function makeCampaign(key: string = "exp_1"): ExperienceCampaign {
    return new ExperienceCampaign(
        key,
        { payloadKey: "payloadValue" },
        { contextKey: "contextValue" },
        DataSource.NETWORK
    );
}

describe("PayloadBuilder", () => {
    describe("buildFetchExperiencesMetaPayload", () => {
        it("wraps statuses into accountMeta + data.status", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesMetaPayload(
                APP_ID, [ExperienceStatus.ACTIVE, ExperienceStatus.PAUSED]
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { status: ["active", "paused"] }
            });
        });

        it("supports empty status array", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesMetaPayload(APP_ID, []));
            expect(json.data.status).toEqual([]);
        });

        it("supports all three statuses", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesMetaPayload(
                APP_ID,
                [ExperienceStatus.ACTIVE, ExperienceStatus.PAUSED, ExperienceStatus.SCHEDULED]
            ));
            expect(json.data.status).toEqual(["active", "paused", "scheduled"]);
        });
    });

    describe("buildFetchExperiencesPayload", () => {
        it("includes experienceKeys and attributes", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesPayload(
                APP_ID, ["k1", "k2"], { plan: "pro" }
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: {
                    experienceKeys: ["k1", "k2"],
                    attributes: { plan: "pro" }
                }
            });
        });

        it("supports empty attributes", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesPayload(APP_ID, ["k1"], {}));
            expect(json.data.attributes).toEqual({});
        });
    });

    describe("buildExperiencesShownPayload", () => {
        it("uses plural 'experiences' key with array of serialized campaigns", () => {
            const json = JSON.parse(PayloadBuilder.buildExperiencesShownPayload(
                APP_ID, [makeCampaign("exp_a"), makeCampaign("exp_b")]
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: {
                    experiences: [
                        { experienceKey: "exp_a", payload: { payloadKey: "payloadValue" }, experienceContext: { contextKey: "contextValue" } },
                        { experienceKey: "exp_b", payload: { payloadKey: "payloadValue" }, experienceContext: { contextKey: "contextValue" } }
                    ]
                }
            });
        });

        it("does NOT include 'source' in serialized campaign (wire contract)", () => {
            const json = JSON.parse(PayloadBuilder.buildExperiencesShownPayload(APP_ID, [makeCampaign()]));
            expect(json.data.experiences[0]).not.toHaveProperty("source");
        });
    });

    describe("buildExperienceClickedPayload", () => {
        it("uses SINGULAR 'experience' key with a single object (regression-prone)", () => {
            const json = JSON.parse(PayloadBuilder.buildExperienceClickedPayload(APP_ID, makeCampaign("exp_x")));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: {
                    experience: {
                        experienceKey: "exp_x",
                        payload: { payloadKey: "payloadValue" },
                        experienceContext: { contextKey: "contextValue" }
                    }
                }
            });
            expect(json.data).not.toHaveProperty("experiences");
        });
    });

    describe("buildOfferingsShownPayload", () => {
        it("uses array of offeringPayloads dicts", () => {
            const json = JSON.parse(PayloadBuilder.buildOfferingsShownPayload(
                APP_ID, [{ a: 1 }, { b: 2 }]
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { offeringPayloads: [{ a: 1 }, { b: 2 }] }
            });
        });
    });

    describe("buildOfferingClickedPayload", () => {
        it("uses singular 'experience' and singular 'offeringPayload' object", () => {
            const json = JSON.parse(PayloadBuilder.buildOfferingClickedPayload(
                APP_ID, makeCampaign("exp_o"), { sku: "123" }
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: {
                    experience: {
                        experienceKey: "exp_o",
                        payload: { payloadKey: "payloadValue" },
                        experienceContext: { contextKey: "contextValue" }
                    },
                    offeringPayload: { sku: "123" }
                }
            });
            expect(Array.isArray(json.data.offeringPayload)).toBe(false);
        });

        it("supports empty offeringPayload object", () => {
            const json = JSON.parse(PayloadBuilder.buildOfferingClickedPayload(
                APP_ID, makeCampaign("exp_o"), {}
            ));
            expect(json.data.offeringPayload).toEqual({});
            expect(json.data.experience.experienceKey).toBe("exp_o");
        });
    });

    describe("empty-input edge cases", () => {
        it("buildFetchExperiencesPayload supports empty experienceKeys", () => {
            const json = JSON.parse(PayloadBuilder.buildFetchExperiencesPayload(APP_ID, [], {}));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { experienceKeys: [], attributes: {} }
            });
        });

        it("buildExperiencesShownPayload supports empty campaigns array", () => {
            const json = JSON.parse(PayloadBuilder.buildExperiencesShownPayload(APP_ID, []));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { experiences: [] }
            });
        });

        it("buildOfferingsShownPayload supports empty offeringPayloads array", () => {
            const json = JSON.parse(PayloadBuilder.buildOfferingsShownPayload(APP_ID, []));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { offeringPayloads: [] }
            });
        });
    });
});
