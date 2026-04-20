import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";

export default class MoELogoutCompleteData {
    accountMeta: MoEAccountMeta;
    platform: MoEPlatform;

    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform) {
        this.accountMeta = accountMeta;
        this.platform = platform;
    }
}
