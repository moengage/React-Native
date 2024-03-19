import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";
import MoEPushCampaign from "./MoEPushCampaign";

export default class MoEPushPayload {
  accountMeta: MoEAccountMeta;
  data: MoEPushCampaign;
  platform: MoEPlatform;
  constructor(accountMeta:  MoEAccountMeta, data: MoEPushCampaign, platform: MoEPlatform) {
    this.accountMeta = accountMeta;
    this.data = data;
    this.platform = platform;
  }
}