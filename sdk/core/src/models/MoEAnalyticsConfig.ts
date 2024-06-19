/**
 * Config class for Analytics
 * Note: This Config is only for iOS platform and is a no-operation method for other plaforms.
 */

export default class MoEAnalyticsConfig {

    shouldTrackUserAttributeBoolAsNumber: boolean;

    /**
     * Create an instance of {@link MoEAnalyticsConfig}
     * 
     * @param shouldTrackUserAttributeBoolAsNumber true to track User attribute TRUE/FALSE as 0/1 
     */
    constructor (shouldTrackUserAttributeBoolAsNumber: boolean) {
        this.shouldTrackUserAttributeBoolAsNumber = shouldTrackUserAttributeBoolAsNumber;
    }

    /**
     * Default Config for {@link MoEAnalyticsConfig}
     */
    static defaultConfig() {
        return new MoEAnalyticsConfig(false);
    }
}