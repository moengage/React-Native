import ExperienceCampaign from "../model/ExperienceCampaign";
import ExperienceCampaignFailure from "../model/ExperienceCampaignFailure";
import ExperienceCampaignMeta from "../model/ExperienceCampaignMeta";
import ExperienceCampaignsMetadata from "../model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "../model/ExperienceCampaignsResult";
import { DataSource } from "../model/DataSource";
import { ExperienceStatus } from "../model/ExperienceStatus";
import * as Constants from "./MoEPersonalizeConstants";

function parseDataSource(value: string): DataSource {
    if (value === DataSource.CACHE) return DataSource.CACHE;
    return DataSource.NETWORK;
}

function parseExperienceStatus(value: string): ExperienceStatus {
    switch (value) {
        case ExperienceStatus.ACTIVE: return ExperienceStatus.ACTIVE;
        case ExperienceStatus.PAUSED: return ExperienceStatus.PAUSED;
        case ExperienceStatus.SCHEDULED: return ExperienceStatus.SCHEDULED;
        default: return ExperienceStatus.ACTIVE;
    }
}

export function parseExperiencesMetadata(payload: string): ExperienceCampaignsMetadata {
    const json = JSON.parse(payload);
    const data = json[Constants.DATA];

    const source = parseDataSource(data[Constants.SOURCE]);
    const experiences: ExperienceCampaignMeta[] = [];

    const experiencesArray = data[Constants.EXPERIENCES];
    if (Array.isArray(experiencesArray)) {
        for (const exp of experiencesArray) {
            experiences.push(new ExperienceCampaignMeta(
                exp[Constants.EXPERIENCE_KEY],
                exp[Constants.EXPERIENCE_NAME],
                parseExperienceStatus(exp[Constants.STATUS])
            ));
        }
    }

    return new ExperienceCampaignsMetadata(source, experiences);
}

export function parseExperiencesResult(payload: string): ExperienceCampaignsResult {
    const json = JSON.parse(payload);
    const data = json[Constants.DATA];

    const experiences: ExperienceCampaign[] = [];
    const failures: ExperienceCampaignFailure[] = [];

    const experiencesArray = data[Constants.EXPERIENCES];
    if (Array.isArray(experiencesArray)) {
        for (const exp of experiencesArray) {
            experiences.push(new ExperienceCampaign(
                exp[Constants.EXPERIENCE_KEY],
                exp[Constants.PAYLOAD],
                exp[Constants.EXPERIENCE_CONTEXT],
                parseDataSource(exp[Constants.SOURCE])
            ));
        }
    }

    const failuresArray = data[Constants.FAILURES];
    if (Array.isArray(failuresArray)) {
        for (const fail of failuresArray) {
            failures.push(new ExperienceCampaignFailure(
                fail[Constants.REASON],
                fail[Constants.EXPERIENCE_KEYS] ?? [],
                fail[Constants.MESSAGE]
            ));
        }
    }

    return new ExperienceCampaignsResult(experiences, failures);
}

export function emptyMetadata(): ExperienceCampaignsMetadata {
    return new ExperienceCampaignsMetadata(DataSource.NETWORK, []);
}

export function emptyResult(): ExperienceCampaignsResult {
    return new ExperienceCampaignsResult([], []);
}
