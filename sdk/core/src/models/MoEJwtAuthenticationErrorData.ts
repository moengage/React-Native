import { MoEJwtErrorCode } from "./MoEJwtErrorCode";
import MoEAuthenticationErrorDetails from "./MoEAuthenticationErrorDetails";

/**
 * Details of a JWT authentication failure delivered with the
 * `authenticationError` event.
 *
 * @since 12.10.0
 */
export default class MoEJwtAuthenticationErrorData extends MoEAuthenticationErrorDetails {

    /**
     * Reason the JWT authentication failed.
     */
    code: MoEJwtErrorCode;

    /**
     * Token that failed authentication.
     */
    token: string;

    /**
     * Identifier of the user the token was issued for.
     */
    userIdentifier: string;

    /**
     * Human readable description of the failure.
     */
    message: string;

    constructor(code: MoEJwtErrorCode, token: string, userIdentifier: string, message: string) {
        super();
        this.code = code;
        this.token = token;
        this.userIdentifier = userIdentifier;
        this.message = message;
    }
}
