import MoEngagePersonalizeBridge from "../NativeMoEngagePersonalize";
import ExperienceCampaign from "../model/ExperienceCampaign";
import ExperienceCampaignsMetadata from "../model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "../model/ExperienceCampaignsResult";
import { ExperienceStatus } from "../model/ExperienceStatus";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG } from "./Constants";
import * as PayloadBuilder from "./utils/PayloadBuilder";
import * as Parser from "./utils/PayloadParser";

/**
 * Helper class that translates Public Personalize APIs into native bridge calls.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class MoEngagePersonalizeHandler {

    private TAG = `${MODULE_TAG}MoEngagePersonalizeHandler`;

    private appId: string;

    constructor(appId: string) {
        this.appId = appId;
        MoEngageLogger.debug(`${this.TAG} constructor() : initialised for appId=${appId}`);
    }

    async fetchExperiencesMeta(statuses: ExperienceStatus[]): Promise<ExperienceCampaignsMetadata> {
        try {
            MoEngageLogger.verbose(`${this.TAG} fetchExperiencesMeta() : `);
            const payload = PayloadBuilder.buildFetchExperiencesMetaPayload(this.appId, statuses);
            const response = await MoEngagePersonalizeBridge.fetchExperiencesMeta(payload);
            return Parser.parseExperiencesMetadata(response);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} fetchExperiencesMeta() : `, error);
            throw error;
        }
    }

    async fetchExperiences(
        experienceKeys: string[],
        attributes: Record<string, string>
    ): Promise<ExperienceCampaignsResult> {
        try {
            MoEngageLogger.verbose(`${this.TAG} fetchExperiences() : `);
            const payload = PayloadBuilder.buildFetchExperiencesPayload(this.appId, experienceKeys, attributes);
            const response = await MoEngagePersonalizeBridge.fetchExperiences(payload);
            return Parser.parseExperiencesResult(response);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} fetchExperiences() : `, error);
            throw error;
        }
    }

    trackExperienceShown(campaigns: ExperienceCampaign[]): void {
        try {
            MoEngageLogger.verbose(`${this.TAG} trackExperienceShown() : `);
            const payload = PayloadBuilder.buildTrackExperienceShownPayload(this.appId, campaigns);
            MoEngagePersonalizeBridge.trackExperienceShown(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} trackExperienceShown() : `, error);
        }
    }

    trackExperienceClicked(campaign: ExperienceCampaign): void {
        try {
            MoEngageLogger.verbose(`${this.TAG} trackExperienceClicked() : `);
            const payload = PayloadBuilder.buildTrackExperienceClickedPayload(this.appId, campaign);
            MoEngagePersonalizeBridge.trackExperienceClicked(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} trackExperienceClicked() : `, error);
        }
    }

    trackOfferingShown(offeringAttributes: Record<string, any>[]): void {
        try {
            MoEngageLogger.verbose(`${this.TAG} trackOfferingShown() : `);
            const payload = PayloadBuilder.buildTrackOfferingShownPayload(this.appId, offeringAttributes);
            MoEngagePersonalizeBridge.trackOfferingShown(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} trackOfferingShown() : `, error);
        }
    }

    trackOfferingClicked(
        campaign: ExperienceCampaign,
        offeringAttributes: Record<string, any>
    ): void {
        try {
            MoEngageLogger.verbose(`${this.TAG} trackOfferingClicked() : `);
            const payload = PayloadBuilder.buildTrackOfferingClickedPayload(this.appId, campaign, offeringAttributes);
            MoEngagePersonalizeBridge.trackOfferingClicked(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} trackOfferingClicked() : `, error);
        }
    }
}
