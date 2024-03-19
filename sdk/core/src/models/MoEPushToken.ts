import { MoEPlatform } from "./MoEPlatform";
import { MoEPushService } from "./MoEPushService";

export default class MoEPushToken {
  platform: MoEPlatform;
  pushService: MoEPushService;
  token: String;

  constructor(platform: MoEPlatform, pushService: MoEPushService, token: String) {
    this.platform = platform;
    this.pushService = pushService;
    this.token = token;
  }
}
