import { MoEAuthenticationType } from "./MoEAuthenticationType";
import MoEAuthenticationDetails from "./MoEAuthenticationDetails";

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
     * Scheme specific payload — a {@link MoEAuthenticationDetails} subtype. For
     * {@link MoEAuthenticationType.JWT} pass a {@link MoEJwtAuthenticationData}.
     */
    data: MoEAuthenticationDetails;
}
