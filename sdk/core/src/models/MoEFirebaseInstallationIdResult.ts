import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";
import { MoEPushService } from "./MoEPushService";

export default class MoEFirebaseInstallationIdResult {
  accountMeta: MoEAccountMeta;
  platform: MoEPlatform;
  pushService: MoEPushService;
  installationId: String;

  constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform, pushService: MoEPushService, installationId: String) {
    this.accountMeta = accountMeta;
    this.platform = platform;
    this.pushService = pushService;
    this.installationId = installationId;
  }
}
