import MoEAccountMeta from "./MoEAccountMeta";
import MoECampaignData from "./MoECampaignData";
import MoEInAppNavigation from "./MoEInAppNavigation";
import { MoEPlatform } from "./MoEPlatform";

export default class MoEInAppClickData {
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;
    campaignData: MoECampaignData;
    action: MoEInAppNavigation;

    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, campaignData: MoECampaignData, action: MoEInAppNavigation) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.campaignData = campaignData;
        this.action = action;
    }

}