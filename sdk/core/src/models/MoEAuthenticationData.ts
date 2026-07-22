import { MoEAuthenticationType } from "./MoEAuthenticationType";
import MoEJwtAuthenticationData from "./MoEJwtAuthenticationData";

/**
 * Authentication details passed to the SDK via
 * {@link ReactMoE.passAuthenticationDetails}.
 *
 * @since 12.10.0
 */
export default interface MoEAuthenticationData {
    /**
     * The authentication scheme. Currently only {@link MoEAuthenticationType.JWT}.
     */
    authenticationType: MoEAuthenticationType;

    /**
     * Scheme specific payload. For {@link MoEAuthenticationType.JWT} this is a
     * {@link MoEJwtAuthenticationData}.
     */
    data: MoEJwtAuthenticationData;
}
