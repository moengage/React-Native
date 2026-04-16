import ExperienceCampaign from "../../model/ExperienceCampaign";
import ExperienceCampaignFailure from "../../model/ExperienceCampaignFailure";
import ExperienceCampaignMeta from "../../model/ExperienceCampaignMeta";
import ExperienceCampaignsMetadata from "../../model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "../../model/ExperienceCampaignsResult";
import { DataSource } from "../../model/DataSource";
import { ExperienceStatus } from "../../model/ExperienceStatus";
import { ExperienceFailureReason, KNOWN_FAILURE_REASONS } from "../../model/ExperienceFailureReason";
import { MoEngageLogger } from "react-native-moengage";
import {
    MODULE_TAG,
    keyData,
    keyStatus,
    keyExperiences,
    keyExperienceKey,
    keyExperienceName,
    keyPayload,
    keyExperienceContext,
    keySource,
    keyFailures,
    keyReason,
    keyExperienceKeys
} from "../Constants";

const TAG = `${MODULE_TAG}PayloadParser`;

function parseDataSource(value: string): DataSource {
    if (value === DataSource.CACHE) return DataSource.CACHE;
    if (value === DataSource.NETWORK) return DataSource.NETWORK;
    MoEngageLogger.warn(`${TAG} parseDataSource() : Unknown DataSource "${value}", defaulting to NETWORK`);
    return DataSource.NETWORK;
}

function parseExperienceStatus(value: string): ExperienceStatus {
    switch (value) {
        case ExperienceStatus.ACTIVE: return ExperienceStatus.ACTIVE;
        case ExperienceStatus.PAUSED: return ExperienceStatus.PAUSED;
        case ExperienceStatus.SCHEDULED: return ExperienceStatus.SCHEDULED;
        default:
            MoEngageLogger.warn(`${TAG} parseExperienceStatus() : Unknown ExperienceStatus "${value}", defaulting to ACTIVE`);
            return ExperienceStatus.ACTIVE;
    }
}

function parseFailureReason(value: string): ExperienceFailureReason {
    if (KNOWN_FAILURE_REASONS.has(value as ExperienceFailureReason)) {
        return value as ExperienceFailureReason;
    }
    MoEngageLogger.warn(`${TAG} parseFailureReason() : Unknown ExperienceFailureReason "${value}", defaulting to PERSONALIZATION_FAILED`);
    return "PERSONALIZATION_FAILED";
}

export function parseExperiencesMetadata(payload: string): ExperienceCampaignsMetadata {
    MoEngageLogger.verbose(`${TAG} parseExperiencesMetadata() : `);
    const json = JSON.parse(payload);
    const data = json[keyData];
    if (data == null || typeof data !== "object") {
        MoEngageLogger.warn(`${TAG} parseExperiencesMetadata() : missing or invalid 'data' key, returning empty result`);
        return new ExperienceCampaignsMetadata(DataSource.NETWORK, []);
    }

    const source = parseDataSource(data[keySource]);
    const experiences: ExperienceCampaignMeta[] = [];

    const experiencesArray = data[keyExperiences];
    if (Array.isArray(experiencesArray)) {
        for (const exp of experiencesArray) {
            if (exp == null || typeof exp !== "object") continue;
            experiences.push(new ExperienceCampaignMeta(
                exp[keyExperienceKey] ?? "",
                exp[keyExperienceName] ?? "",
                parseExperienceStatus(exp[keyStatus])
            ));
        }
    }

    return new ExperienceCampaignsMetadata(source, experiences);
}

export function parseExperiencesResult(payload: string): ExperienceCampaignsResult {
    MoEngageLogger.verbose(`${TAG} parseExperiencesResult() : `);
    const json = JSON.parse(payload);
    const data = json[keyData];
    if (data == null || typeof data !== "object") {
        MoEngageLogger.warn(`${TAG} parseExperiencesResult() : missing or invalid 'data' key, returning empty result`);
        return new ExperienceCampaignsResult([], []);
    }

    const experiences: ExperienceCampaign[] = [];
    const failures: ExperienceCampaignFailure[] = [];

    const experiencesArray = data[keyExperiences];
    if (Array.isArray(experiencesArray)) {
        for (const exp of experiencesArray) {
            if (exp == null || typeof exp !== "object") continue;
            experiences.push(new ExperienceCampaign(
                exp[keyExperienceKey] ?? "",
                exp[keyPayload] ?? {},
                exp[keyExperienceContext] ?? {},
                parseDataSource(exp[keySource])
            ));
        }
    }

    const failuresArray = data[keyFailures];
    if (Array.isArray(failuresArray)) {
        for (const fail of failuresArray) {
            if (fail == null || typeof fail !== "object") continue;
            failures.push(new ExperienceCampaignFailure(
                parseFailureReason(fail[keyReason]),
                fail[keyExperienceKeys] ?? []
            ));
        }
    }

    return new ExperienceCampaignsResult(experiences, failures);
}
