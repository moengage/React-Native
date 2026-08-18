import MoEAccountMeta from "./MoEAccountMeta";
import { MoEPlatform } from "./MoEPlatform";
import { MoEAuthenticationType } from "./MoEAuthenticationType";
import MoEAuthenticationErrorDetails from "./MoEAuthenticationErrorDetails";

/**
 * Data delivered with the `authenticationError` event when the SDK fails to
 * authenticate a network request (e.g. an invalid or expired JWT). Listen for
 * it via {@link ReactMoE.setEventListener} and refresh the token by calling
 * {@link ReactMoE.passAuthenticationDetails} again.
 *
 * @since 12.10.0
 */
export default class MoEAuthenticationErrorData {

    /**
     * Account meta data, instance of {@link MoEAccountMeta}
     */
    accountMeta: MoEAccountMeta;

    /**
     * Platform on which the error occurred.
     */
    platform: MoEPlatform;

    /**
     * Authentication scheme that failed.
     */
    authenticationType: MoEAuthenticationType;

    /**
     * Scheme specific error details — a {@link MoEAuthenticationErrorDetails}
     * subtype. For {@link MoEAuthenticationType.JWT} this is a
     * {@link MoEJwtAuthenticationErrorData}.
     */
    data: MoEAuthenticationErrorDetails;

    constructor(
        accountMeta: MoEAccountMeta,
        platform: MoEPlatform,
        authenticationType: MoEAuthenticationType,
        data: MoEAuthenticationErrorDetails
    ) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.authenticationType = authenticationType;
        this.data = data;
    }
}
