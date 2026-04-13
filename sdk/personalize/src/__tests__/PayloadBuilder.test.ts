import "ts-jest";
import "jest";
import * as PayloadBuilder from "../internal/MoEPersonalizePayloadBuilder";
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

    describe("buildTrackExperienceShownPayload", () => {
        it("uses plural 'experiences' key with array of serialized campaigns", () => {
            const json = JSON.parse(PayloadBuilder.buildTrackExperienceShownPayload(
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
            const json = JSON.parse(PayloadBuilder.buildTrackExperienceShownPayload(APP_ID, [makeCampaign()]));
            expect(json.data.experiences[0]).not.toHaveProperty("source");
        });
    });

    describe("buildTrackExperienceClickedPayload", () => {
        it("uses SINGULAR 'experience' key with a single object (regression-prone)", () => {
            const json = JSON.parse(PayloadBuilder.buildTrackExperienceClickedPayload(APP_ID, makeCampaign("exp_x")));
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

    describe("buildTrackOfferingShownPayload", () => {
        it("uses array of offeringAttributes dicts", () => {
            const json = JSON.parse(PayloadBuilder.buildTrackOfferingShownPayload(
                APP_ID, [{ a: 1 }, { b: 2 }]
            ));
            expect(json).toEqual({
                accountMeta: { appId: APP_ID },
                data: { offeringAttributes: [{ a: 1 }, { b: 2 }] }
            });
        });
    });

    describe("buildTrackOfferingClickedPayload", () => {
        it("uses singular 'experience' and singular 'offeringAttributes' object", () => {
            const json = JSON.parse(PayloadBuilder.buildTrackOfferingClickedPayload(
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
                    offeringAttributes: { sku: "123" }
                }
            });
            expect(Array.isArray(json.data.offeringAttributes)).toBe(false);
        });
    });
});
