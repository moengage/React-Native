import ExperienceCampaign from "../model/ExperienceCampaign";
import { ExperienceStatus } from "../model/ExperienceStatus";

function getAccountMetaPayload(appId: string) {
    return { appId: appId };
}

function serializeCampaign(campaign: ExperienceCampaign) {
    return {
        experienceKey: campaign.experienceKey,
        payload: campaign.payload,
        experienceContext: campaign.experienceContext
    };
}

export function buildFetchExperiencesMetaPayload(appId: string, statuses: ExperienceStatus[]): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            status: statuses
        }
    };
    return JSON.stringify(payload);
}

export function buildFetchExperiencesPayload(appId: string, experienceKeys: string[], attributes: Record<string, string>): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experienceKeys: experienceKeys,
            attributes: attributes
        }
    };
    return JSON.stringify(payload);
}

export function buildTrackExperienceShownPayload(appId: string, campaigns: ExperienceCampaign[]): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experiences: campaigns.map(serializeCampaign)
        }
    };
    return JSON.stringify(payload);
}

export function buildTrackExperienceClickedPayload(appId: string, campaign: ExperienceCampaign): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experience: serializeCampaign(campaign)
        }
    };
    return JSON.stringify(payload);
}

export function buildTrackOfferingShownPayload(appId: string, offeringAttributes: Record<string, any>[]): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            offeringAttributes: offeringAttributes
        }
    };
    return JSON.stringify(payload);
}

export function buildTrackOfferingClickedPayload(
    appId: string,
    campaign: ExperienceCampaign,
    offeringAttributes: Record<string, any>
): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experience: serializeCampaign(campaign),
            offeringAttributes: offeringAttributes
        }
    };
    return JSON.stringify(payload);
}
