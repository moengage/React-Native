import MoEAccountMeta from "./MoEAccountMeta";
import MoEJwtErrorCode from "./MoEJwtErrorCode";

/**
 * JWT authentication error details emitted by the MoEngage SDK.
 *
 * @since 1.0.0
 */
export default class MoEAuthenticationErrorData {

    accountMeta: MoEAccountMeta;
    platform: string;
    authenticationType: string;
    code: MoEJwtErrorCode;
    token: string;
    userIdentifier: string;
    message: string;

    constructor(
        accountMeta: MoEAccountMeta,
        platform: string,
        authenticationType: string,
        code: MoEJwtErrorCode,
        token: string,
        userIdentifier: string,
        message: string
    ) {
        this.accountMeta = accountMeta;
        this.platform = platform;
        this.authenticationType = authenticationType;
        this.code = code;
        this.token = token;
        this.userIdentifier = userIdentifier;
        this.message = message;
    }
}
