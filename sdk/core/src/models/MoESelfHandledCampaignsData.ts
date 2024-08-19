import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";
import MoESelfHandledCampaignInfo from "./MoESelfHandledCampaignInfo";

/**
 * Model for Multiple SelfHandled Data
 */
export default class MoESelfHandledCampaignsData {
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;
    campaigns: Array<MoESelfHandledCampaignInfo>

    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, campaigns: Array<MoESelfHandledCampaignInfo>) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.campaigns = campaigns;
    }
}