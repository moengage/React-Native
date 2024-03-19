import MoECampaignContext from "./MoECampaignContext";

export default class MoECampaignData {
    campaignId: string;
    campaignName: string;
    context: MoECampaignContext;

    constructor(campaignId: string, campaignName: string, context: MoECampaignContext) {
        this.campaignId = campaignId;
        this.campaignName = campaignName;
        this.context = context;
    }

}