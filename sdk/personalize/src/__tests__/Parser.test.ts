import "ts-jest";
import "jest";
import * as Parser from "../internal/MoEPersonalizeParser";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

// All 16 failure reasons from the PluginBase FailureReasons enum.
const FAILURE_REASONS = [
    "USER_IN_CAMPAIGN_CONTROL_GROUP",
    "USER_IN_GLOBAL_CONTROL_GROUP",
    "USER_NOT_IN_SEGMENT",
    "IN_VALID_EXPERIENCE_KEY",
    "MAX_LIMIT_BREACHED",
    "EXPERIENCE_NOT_ACTIVE",
    "EXPERIENCE_EXPIRED",
    "PERSONALIZATION_FAILED",
    "SDK_NOT_INITIALIZED",
    "SDK_DISABLED",
    "FEATURE_DISABLED",
    "NETWORK_ERROR",
    "HTTP_ERROR",
    "PARSE_ERROR",
    "UNKNOWN_SERVER_ERROR",
    "UNKNOWN",
];

describe("Parser", () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    describe("parseExperiencesMetadata", () => {
        it("parses CACHE source and multiple experiences with statuses", () => {
            const payload = JSON.stringify({
                accountMeta: { appId: "x" },
                data: {
                    source: "CACHE",
                    experiences: [
                        { experienceKey: "k1", experienceName: "n1", status: "active" },
                        { experienceKey: "k2", experienceName: "n2", status: "paused" },
                        { experienceKey: "k3", experienceName: "n3", status: "scheduled" }
                    ]
                }
            });
            const result = Parser.parseExperiencesMetadata(payload);
            expect(result.source).toBe(DataSource.CACHE);
            expect(result.experiences).toHaveLength(3);
            expect(result.experiences[0]!.status).toBe(ExperienceStatus.ACTIVE);
            expect(result.experiences[1]!.status).toBe(ExperienceStatus.PAUSED);
            expect(result.experiences[2]!.status).toBe(ExperienceStatus.SCHEDULED);
        });

        it("parses NETWORK source", () => {
            const payload = JSON.stringify({
                accountMeta: {}, data: { source: "NETWORK", experiences: [] }
            });
            expect(Parser.parseExperiencesMetadata(payload).source).toBe(DataSource.NETWORK);
        });

        it("handles empty experiences array", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { source: "NETWORK", experiences: [] } });
            expect(Parser.parseExperiencesMetadata(payload).experiences).toEqual([]);
        });

        it("defaults unknown status to ACTIVE and warns", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    source: "NETWORK",
                    experiences: [{ experienceKey: "k", experienceName: "n", status: "archived" }]
                }
            });
            expect(Parser.parseExperiencesMetadata(payload).experiences[0]!.status).toBe(ExperienceStatus.ACTIVE);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("archived"));
        });

        it("defaults unknown source to NETWORK and warns", () => {
            const payload = JSON.stringify({
                accountMeta: {}, data: { source: "FOO", experiences: [] }
            });
            expect(Parser.parseExperiencesMetadata(payload).source).toBe(DataSource.NETWORK);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("FOO"));
        });

        it("throws on malformed JSON (caller handles)", () => {
            expect(() => Parser.parseExperiencesMetadata("{not json")).toThrow();
        });
    });

    describe("parseExperiencesResult", () => {
        it("parses experiences with payload, context, and source", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [
                        {
                            experienceKey: "k1",
                            payload: { p: 1 },
                            experienceContext: { c: "v" },
                            source: "CACHE"
                        }
                    ],
                    failures: []
                }
            });
            const result = Parser.parseExperiencesResult(payload);
            expect(result.experiences).toHaveLength(1);
            const e = result.experiences[0]!;
            expect(e.experienceKey).toBe("k1");
            expect(e.payload).toEqual({ p: 1 });
            expect(e.experienceContext).toEqual({ c: "v" });
            expect(e.source).toBe(DataSource.CACHE);
        });

        it("parses failures with reason, experienceKeys, and optional message", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [],
                    failures: [
                        { reason: "EXPERIENCE_EXPIRED", experienceKeys: ["k1", "k2"], message: "expired" },
                        { reason: "USER_NOT_IN_SEGMENT", experienceKeys: ["k3"] }
                    ]
                }
            });
            const result = Parser.parseExperiencesResult(payload);
            expect(result.failures).toHaveLength(2);
            expect(result.failures[0]!.reason).toBe("EXPERIENCE_EXPIRED");
            expect(result.failures[0]!.experienceKeys).toEqual(["k1", "k2"]);
            expect(result.failures[0]!.message).toBe("expired");
            expect(result.failures[1]!.message).toBeUndefined();
        });

        it("defaults missing experienceKeys in a failure to empty array", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [], failures: [{ reason: "UNKNOWN" }] }
            });
            expect(Parser.parseExperiencesResult(payload).failures[0]!.experienceKeys).toEqual([]);
        });

        it("handles response with only experiences", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [{ experienceKey: "k", payload: {}, experienceContext: {}, source: "NETWORK" }],
                    failures: []
                }
            });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toHaveLength(1);
            expect(r.failures).toHaveLength(0);
        });

        it("handles response with only failures", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [],
                    failures: [{ reason: "NETWORK_ERROR", experienceKeys: ["k"] }]
                }
            });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toHaveLength(0);
            expect(r.failures).toHaveLength(1);
        });

        it.each(FAILURE_REASONS)("accepts all 16 known failure reasons as strings: %s", (reason) => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [], failures: [{ reason, experienceKeys: [] }] }
            });
            expect(Parser.parseExperiencesResult(payload).failures[0]!.reason).toBe(reason);
        });
    });
});
