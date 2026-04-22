import ExperienceCampaign from "../../model/ExperienceCampaign";
import { ExperienceStatus } from "../../model/ExperienceStatus";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG } from "../Constants";

const TAG = `${MODULE_TAG}PayloadBuilder`;

function getAccountMetaPayload(appId: string) {
    return { appId: appId };
}

function serializeCampaign(campaign: ExperienceCampaign) {
    if (campaign.payload == null) {
        MoEngageLogger.warn(`${TAG} serializeCampaign() : campaign.payload is null/undefined for "${campaign.experienceKey}"`);
    }
    if (campaign.experienceContext == null) {
        MoEngageLogger.warn(`${TAG} serializeCampaign() : campaign.experienceContext is null/undefined for "${campaign.experienceKey}"`);
    }
    return {
        experienceKey: campaign.experienceKey,
        payload: campaign.payload,
        experienceContext: campaign.experienceContext,
        source: campaign.source
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

export function buildExperiencesShownPayload(appId: string, campaigns: ExperienceCampaign[]): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experiences: campaigns.map(serializeCampaign)
        }
    };
    return JSON.stringify(payload);
}

export function buildExperienceClickedPayload(appId: string, campaign: ExperienceCampaign): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experience: serializeCampaign(campaign)
        }
    };
    return JSON.stringify(payload);
}

export function buildOfferingsShownPayload(appId: string, offeringPayloads: Record<string, any>[]): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            offeringPayloads: offeringPayloads
        }
    };
    return JSON.stringify(payload);
}

export function buildOfferingClickedPayload(
    appId: string,
    campaign: ExperienceCampaign,
    offeringPayload: Record<string, any>
): string {
    let payload = {
        accountMeta: getAccountMetaPayload(appId),
        data: {
            experience: serializeCampaign(campaign),
            offeringPayload: offeringPayload
        }
    };
    return JSON.stringify(payload);
}
