import MoEAccountMeta from "./MoEAccountMeta";
import MoECampaignData from "./MoECampaignData";
import { MoEPlatform } from "./MoEPlatform";

export default class MoEInAppData {
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;
    campaignData: MoECampaignData;

    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, campaignData: MoECampaignData) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.campaignData = campaignData;
    }

}