import MoEAccountMeta from "./MoEAccountMeta";
import MoECampaignData from "./MoECampaignData";
import { MoEPlatform } from "./MoEPlatform";
import MoESelfHandledCampaign from "./MoESelfHandledCampaign";

export default class MoESelfHandledCampaignData {
    campaignData:MoECampaignData;
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;
    campaign: MoESelfHandledCampaign
    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, campaign: MoESelfHandledCampaign,campaignData:MoECampaignData) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.campaign = campaign;
        this.campaignData = campaignData;
    }

}