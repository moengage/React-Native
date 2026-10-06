import { MoEUserAttributeLevel } from "./MoEUserAttributeLevel";

/**
 * Result of {@link ReactMoE.unsetUserAttribute}.
 *
 * @since 13.1.0
 */
export default class MoEUnsetUserAttributeResult {

    /**
     * Name of the attribute passed to the unset call.
     */
    attributeName: string;

    /**
     * Level passed to the unset call.
     */
    attributeLevel: MoEUserAttributeLevel;

    constructor(
        attributeName: string,
        attributeLevel: MoEUserAttributeLevel
    ) {
        this.attributeName = attributeName;
        this.attributeLevel = attributeLevel;
    }
}
