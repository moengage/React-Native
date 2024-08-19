import MoESelfHandledCampaign from "./MoESelfHandledCampaign";
import MoECampaignData from "./MoECampaignData";

/**
 * Self Handled Campaign Info.
 */
export default class MoESelfHandledCampaignInfo {
    /**
     * Campaign data
     */
    campaignData: MoECampaignData

    /**
     * Selfhandled campaign details
     */
    campaign: MoESelfHandledCampaign

    constructor(campaignData: MoECampaignData, selfHandled: MoESelfHandledCampaign) {
        this.campaignData = campaignData;
        this.campaign = selfHandled;
    }
}