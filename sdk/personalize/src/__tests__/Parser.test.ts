import "ts-jest";
import "jest";

const mockLogger = {
    verbose: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
};

jest.mock("react-native-moengage", () => ({
    MoEngageLogger: mockLogger,
}));

import * as Parser from "../internal/utils/PayloadParser";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";

// 8 server-side failure reasons from the contract proto enum.
// SDK-level errors (NETWORK_ERROR, SDK_NOT_INITIALIZED, etc.) surface via the
// error wrapper / Promise.reject path, not as per-experience failures.
const FAILURE_REASONS = [
    "USER_IN_CAMPAIGN_CONTROL_GROUP",
    "USER_IN_GLOBAL_CONTROL_GROUP",
    "USER_NOT_IN_SEGMENT",
    "IN_VALID_EXPERIENCE_KEY",
    "MAX_LIMIT_BREACHED",
    "EXPERIENCE_NOT_ACTIVE",
    "EXPERIENCE_EXPIRED",
    "PERSONALIZATION_FAILED",
];

describe("Parser", () => {
    const warnSpy = mockLogger.warn;

    beforeEach(() => {
        warnSpy.mockClear();
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

        it("returns empty result and warns when 'data' key is missing", () => {
            const payload = JSON.stringify({ accountMeta: {} });
            const result = Parser.parseExperiencesMetadata(payload);
            expect(result.source).toBe(DataSource.NETWORK);
            expect(result.experiences).toEqual([]);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("missing or invalid 'data'"));
        });

        it("treats null experiences as empty array", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { source: "NETWORK", experiences: null } });
            expect(Parser.parseExperiencesMetadata(payload).experiences).toEqual([]);
        });

        it("treats non-array experiences as empty array", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { source: "NETWORK", experiences: { not: "array" } } });
            expect(Parser.parseExperiencesMetadata(payload).experiences).toEqual([]);
        });

        it("treats undefined experiences as empty array", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { source: "NETWORK" } });
            expect(Parser.parseExperiencesMetadata(payload).experiences).toEqual([]);
        });

        it("defaults missing experienceKey/experienceName to empty string", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { source: "NETWORK", experiences: [{ status: "active" }] }
            });
            const meta = Parser.parseExperiencesMetadata(payload).experiences[0]!;
            expect(meta.experienceKey).toBe("");
            expect(meta.experienceName).toBe("");
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

        it("parses failures with reason and experienceKeys", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [],
                    failures: [
                        { reason: "EXPERIENCE_EXPIRED", experienceKeys: ["k1", "k2"] },
                        { reason: "USER_NOT_IN_SEGMENT", experienceKeys: ["k3"] }
                    ]
                }
            });
            const result = Parser.parseExperiencesResult(payload);
            expect(result.failures).toHaveLength(2);
            expect(result.failures[0]!.reason).toBe("EXPERIENCE_EXPIRED");
            expect(result.failures[0]!.experienceKeys).toEqual(["k1", "k2"]);
            expect(result.failures[1]!.reason).toBe("USER_NOT_IN_SEGMENT");
        });

        it("defaults missing experienceKeys in a failure to empty array", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [], failures: [{ reason: "EXPERIENCE_EXPIRED" }] }
            });
            expect(Parser.parseExperiencesResult(payload).failures[0]!.experienceKeys).toEqual([]);
        });

        it("defaults unknown failure reason to PERSONALIZATION_FAILED and warns", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [], failures: [{ reason: "MYSTERY_REASON", experienceKeys: ["k"] }] }
            });
            expect(Parser.parseExperiencesResult(payload).failures[0]!.reason).toBe("PERSONALIZATION_FAILED");
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("MYSTERY_REASON"));
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
                    failures: [{ reason: "EXPERIENCE_EXPIRED", experienceKeys: ["k"] }]
                }
            });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toHaveLength(0);
            expect(r.failures).toHaveLength(1);
        });

        it.each(FAILURE_REASONS)("accepts all 8 server-side failure reasons: %s", (reason) => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [], failures: [{ reason, experienceKeys: [] }] }
            });
            expect(Parser.parseExperiencesResult(payload).failures[0]!.reason).toBe(reason);
        });

        it("parses experiences with NETWORK source per-entry", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [
                        { experienceKey: "k", payload: {}, experienceContext: {}, source: "NETWORK" }
                    ],
                    failures: []
                }
            });
            expect(Parser.parseExperiencesResult(payload).experiences[0]!.source).toBe(DataSource.NETWORK);
        });

        it("defaults unknown per-experience source to NETWORK and warns", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: {
                    experiences: [
                        { experienceKey: "k", payload: {}, experienceContext: {}, source: "QUANTUM" }
                    ],
                    failures: []
                }
            });
            expect(Parser.parseExperiencesResult(payload).experiences[0]!.source).toBe(DataSource.NETWORK);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("QUANTUM"));
        });

        it("throws on malformed JSON (caller handles)", () => {
            expect(() => Parser.parseExperiencesResult("{not json")).toThrow();
        });

        it("returns empty result and warns when 'data' key is missing", () => {
            const payload = JSON.stringify({ accountMeta: {} });
            const result = Parser.parseExperiencesResult(payload);
            expect(result.experiences).toEqual([]);
            expect(result.failures).toEqual([]);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("missing or invalid 'data'"));
        });

        it("treats null experiences/failures as empty arrays", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { experiences: null, failures: null } });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toEqual([]);
            expect(r.failures).toEqual([]);
        });

        it("treats non-array experiences/failures as empty arrays", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: { experiences: { not: "array" }, failures: 42 } });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toEqual([]);
            expect(r.failures).toEqual([]);
        });

        it("treats undefined experiences/failures as empty arrays", () => {
            const payload = JSON.stringify({ accountMeta: {}, data: {} });
            const r = Parser.parseExperiencesResult(payload);
            expect(r.experiences).toEqual([]);
            expect(r.failures).toEqual([]);
        });

        it("defaults missing experience fields to safe defaults", () => {
            const payload = JSON.stringify({
                accountMeta: {},
                data: { experiences: [{}], failures: [] }
            });
            const e = Parser.parseExperiencesResult(payload).experiences[0]!;
            expect(e.experienceKey).toBe("");
            expect(e.payload).toEqual({});
            expect(e.experienceContext).toEqual({});
            expect(e.source).toBe(DataSource.NETWORK);
        });
    });
});
