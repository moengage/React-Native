import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";

/**
 * Data class containing the result of logout operation
 *
 * @author Anirudha Mayya
 * @since 12.7.0
 */
export default class MoELogoutCompleteData {

    /**
     * Account meta data, instance of {@link MoEAccountMeta}
     * @since 12.7.0
     */
    accountMeta: MoEAccountMeta;

    /**
     * Platform on which the logout was performed
     * @since 12.7.0
     */
    platform: MoEPlatform;

    constructor(accountMeta: MoEAccountMeta, platform: MoEPlatform) {
        this.accountMeta = accountMeta;
        this.platform = platform;
    }
}
