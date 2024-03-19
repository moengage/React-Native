import MoEngageLogConfig from "./MoEngageLogConfig";
import MoEPushConfig from "./MoEPushConfig";

/**
 * Config class for MoEngage SDK
 * Note: This Config is only for Android platform and is a no-operation method for other plaforms.
 */
export default class MoEInitConfig {

    pushConfig: MoEPushConfig = MoEPushConfig.defaultConfig();

    logConfig: MoEngageLogConfig = MoEngageLogConfig.defaultConfig();

    /**
     * Create an instance of {@link MoEInitConfig}
     * 
     * @param pushConfig instance of {@link MoEPushConfig}
     * @param logConfig instance of {@link MoEngageLogConfig}
     */
    constructor(pushConfig: MoEPushConfig = MoEPushConfig.defaultConfig(),
        logConfig: MoEngageLogConfig = MoEngageLogConfig.defaultConfig()
    ) {
        this.pushConfig = pushConfig;
        this.logConfig = logConfig;
    }

    /**
     * Default Config for {@link MoEInitConfig}
     */
    static defaultConfig() {
        return new MoEInitConfig(
            MoEPushConfig.defaultConfig(),
            MoEngageLogConfig.defaultConfig()
        );
    }
}