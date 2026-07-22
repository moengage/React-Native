/**
 * JWT authentication payload passed to the SDK via
 * {@link ReactMoE.passAuthenticationDetails}.
 *
 * @since 12.10.0
 */
export default interface MoEJwtAuthenticationData {
    /**
     * The signed JWT token issued for the user.
     */
    token: string;

    /**
     * Unique identifier of the user the token was issued for.
     */
    userIdentifier: string;
}
