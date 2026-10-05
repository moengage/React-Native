import MoEAccountMeta from "./MoEAccountMeta";
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
     * Name of the attribute passed to the unset call.
     */
    attributeName: string;

    /**
     * Level passed to the unset call.
     */
    attributeLevel: MoEUserAttributeLevel;

    constructor(
        accountMeta: MoEAccountMeta,
        attributeName: string,
        attributeLevel: MoEUserAttributeLevel
    ) {
        this.accountMeta = accountMeta;
        this.attributeName = attributeName;
        this.attributeLevel = attributeLevel;
    }
}
