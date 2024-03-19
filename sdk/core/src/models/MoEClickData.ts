import MoEAccountMeta from "./MoEAccountMeta";
import MoECampaignData from "./MoECampaignData";
import MoEAction from "./MoEAction";
import { MoEPlatform } from "./MoEPlatform";

export default class MoEClickData {
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;
    campaignData: MoECampaignData;
    action: MoEAction;
    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, campaignData: MoECampaignData, action: MoEAction) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.campaignData = campaignData;
        this.action = action;
    }

}