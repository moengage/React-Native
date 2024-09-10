import MoEAccountMeta from "./MoEAccountMeta";
import MoESelfHandledCampaignData from "./MoESelfHandledCampaignData";

/**
 * Model for Multiple SelfHandled Data
 */
export default class MoESelfHandledCampaignsData {
    accountMeta: MoEAccountMeta;
    campaigns: Array<MoESelfHandledCampaignData>

    constructor(accountMeta: MoEAccountMeta, campaigns: Array<MoESelfHandledCampaignData>) {
        this.accountMeta = accountMeta;
        this.campaigns = campaigns;
    }
}