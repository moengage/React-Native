import MoEAccountMeta from "./MoEAccountMeta";
import MoERequestFailure from "./MoERequestFailure";
import { MoEUserAttributeLevel } from "./MoEUserAttributeLevel";

/**
 * Result of {@link ReactMoE.unsetUserAttribute}.
 *
 * @since 13.1.0
 */
export default class MoEUnsetUserAttributeResult {

    /**
     * Account Data, instance of {@link MoEAccountMeta}
     */
    accountMeta: MoEAccountMeta;

    /**
     * true if the unset was validated and saved on the device, else false.
     * It does not mean the server has processed it.
     */
    isUnsetSuccess: boolean;

    /**
     * Name of the attribute passed to the unset call.
     */
    attributeName: string;

    /**
     * Level passed to the unset call.
     */
    attributeLevel: MoEUserAttributeLevel;

    /**
     * Failure details when isUnsetSuccess is false, else null.
     */
    failure: MoERequestFailure | null;

    constructor(
        accountMeta: MoEAccountMeta,
        isUnsetSuccess: boolean,
        attributeName: string,
        attributeLevel: MoEUserAttributeLevel,
        failure: MoERequestFailure | null = null
    ) {
        this.accountMeta = accountMeta;
        this.isUnsetSuccess = isUnsetSuccess;
        this.attributeName = attributeName;
        this.attributeLevel = attributeLevel;
        this.failure = failure;
    }
}
