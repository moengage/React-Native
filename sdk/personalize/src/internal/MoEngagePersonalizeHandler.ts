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
            const payload = PayloadBuilder.buildFetchExperiencesMetaPayload(this.appId, statuses);
            MoEngageLogger.verbose(`${this.TAG} fetchExperiencesMeta() : ${payload}`);
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
            const payload = PayloadBuilder.buildFetchExperiencesPayload(this.appId, experienceKeys, attributes);
            MoEngageLogger.verbose(`${this.TAG} fetchExperiences() : ${payload}`);
            const response = await MoEngagePersonalizeBridge.fetchExperiences(payload);
            return Parser.parseExperiencesResult(response);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} fetchExperiences() : `, error);
            throw error;
        }
    }

    experiencesShown(campaigns: ExperienceCampaign[]): void {
        try {
            const payload = PayloadBuilder.buildExperiencesShownPayload(this.appId, campaigns);
            MoEngageLogger.verbose(`${this.TAG} experiencesShown() : ${payload}`);
            MoEngagePersonalizeBridge.experiencesShown(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} experiencesShown() : `, error);
        }
    }

    experienceClicked(campaign: ExperienceCampaign): void {
        try {
            const payload = PayloadBuilder.buildExperienceClickedPayload(this.appId, campaign);
            MoEngageLogger.verbose(`${this.TAG} experienceClicked() : ${payload}`);
            MoEngagePersonalizeBridge.experienceClicked(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} experienceClicked() : `, error);
        }
    }

    offeringsShown(offeringPayloads: Record<string, any>[]): void {
        try {
            const payload = PayloadBuilder.buildOfferingsShownPayload(this.appId, offeringPayloads);
            MoEngageLogger.verbose(`${this.TAG} offeringsShown() : ${payload}`);
            MoEngagePersonalizeBridge.offeringsShown(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} offeringsShown() : `, error);
        }
    }

    offeringClicked(
        campaign: ExperienceCampaign,
        offeringPayload: Record<string, any>
    ): void {
        try {
            const payload = PayloadBuilder.buildOfferingClickedPayload(this.appId, campaign, offeringPayload);
            MoEngageLogger.verbose(`${this.TAG} offeringClicked() : ${payload}`);
            MoEngagePersonalizeBridge.offeringClicked(payload);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} offeringClicked() : `, error);
        }
    }
}
