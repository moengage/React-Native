/**
 * Base type for the scheme-specific authentication payload carried by
 * {@link MoEAuthenticationData}. Extend this to add authentication schemes
 * beyond {@link MoEAuthenticationType.JWT} in the future.
 *
 * @since 12.10.0
 */
export default class MoEAuthenticationDetails {}
