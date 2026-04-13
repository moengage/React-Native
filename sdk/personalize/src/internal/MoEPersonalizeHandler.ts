import MoEngageReactPersonalize from "../NativeMoEngagePersonalize";
import ExperienceCampaign from "../model/ExperienceCampaign";
import ExperienceCampaignsMetadata from "../model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "../model/ExperienceCampaignsResult";
import { ExperienceStatus } from "../model/ExperienceStatus";
import * as PayloadBuilder from "./MoEPersonalizePayloadBuilder";
import * as Parser from "./MoEPersonalizeParser";

export async function fetchExperiencesMeta(appId: string, statuses: ExperienceStatus[]): Promise<ExperienceCampaignsMetadata> {
    const payload = PayloadBuilder.buildFetchExperiencesMetaPayload(appId, statuses);
    const response = await MoEngageReactPersonalize.fetchExperiencesMeta(payload);
    return Parser.parseExperiencesMetadata(response);
}

export async function fetchExperiences(
    appId: string,
    experienceKeys: string[],
    attributes: Record<string, string>
): Promise<ExperienceCampaignsResult> {
    const payload = PayloadBuilder.buildFetchExperiencesPayload(appId, experienceKeys, attributes);
    const response = await MoEngageReactPersonalize.fetchExperiences(payload);
    return Parser.parseExperiencesResult(response);
}

export function trackExperienceShown(appId: string, campaigns: ExperienceCampaign[]): void {
    const payload = PayloadBuilder.buildTrackExperienceShownPayload(appId, campaigns);
    MoEngageReactPersonalize.trackExperienceShown(payload);
}

export function trackExperienceClicked(appId: string, campaign: ExperienceCampaign): void {
    const payload = PayloadBuilder.buildTrackExperienceClickedPayload(appId, campaign);
    MoEngageReactPersonalize.trackExperienceClicked(payload);
}

export function trackOfferingShown(appId: string, offeringAttributes: Record<string, any>[]): void {
    const payload = PayloadBuilder.buildTrackOfferingShownPayload(appId, offeringAttributes);
    MoEngageReactPersonalize.trackOfferingShown(payload);
}

export function trackOfferingClicked(
    appId: string,
    campaign: ExperienceCampaign,
    offeringAttributes: Record<string, any>
): void {
    const payload = PayloadBuilder.buildTrackOfferingClickedPayload(appId, campaign, offeringAttributes);
    MoEngageReactPersonalize.trackOfferingClicked(payload);
}
