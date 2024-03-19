/**
 * Config class for Push Notification
 * Note: This Config is only for Android platform and is a no-operation method for other plaforms.
 */
export default class MoEPushConfig {

    shouldDeliverCallbackOnForegroundClick: boolean;

    /**
     * Create an instance of {@link MoEPushConfig}
     * 
     * @param shouldDeliverCallbackOnForegroundClick true to handle the callback in the hybrid side 
     * if notification is clicked in foreground,
     */
    constructor (shouldDeliverCallbackOnForegroundClick: boolean) {
        this.shouldDeliverCallbackOnForegroundClick = shouldDeliverCallbackOnForegroundClick;
    }

    /**
     * Default Config for {@link MoEPushConfig}
     */
    static defaultConfig() {
        return new MoEPushConfig(false);
    }
}