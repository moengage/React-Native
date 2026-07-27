import MoEAuthenticationDetails from "./MoEAuthenticationDetails";

/**
 * JWT authentication payload passed to the SDK via
 * {@link ReactMoE.passAuthenticationDetails}.
 *
 * @since 12.10.0
 */
export default class MoEJwtAuthenticationData extends MoEAuthenticationDetails {

    /**
     * The signed JWT token issued for the user.
     */
    token: string;

    /**
     * Unique identifier of the user the token was issued for.
     */
    userIdentifier: string;

    constructor(token: string, userIdentifier: string) {
        super();
        this.token = token;
        this.userIdentifier = userIdentifier;
    }
}
