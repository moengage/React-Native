import MoEngageLogConfig from "./MoEngageLogConfig";
import MoEPushConfig from "./MoEPushConfig";
import MoEAnalyticsConfig from "./MoEAnalyticsConfig"

/**
 * Config class for MoEngage SDK
 */
export default class MoEInitConfig {

    pushConfig: MoEPushConfig = MoEPushConfig.defaultConfig();

    logConfig: MoEngageLogConfig = MoEngageLogConfig.defaultConfig();

    analyticsConfig = MoEAnalyticsConfig.defaultConfig();

    /**
     * Create an instance of {@link MoEInitConfig}
     * 
     * @param pushConfig instance of {@link MoEPushConfig}
     * @param logConfig instance of {@link MoEngageLogConfig}
     * @param analyticsConfig instance of {@link MoEAnalyticsConfig}
     */
    constructor(pushConfig: MoEPushConfig = MoEPushConfig.defaultConfig(),
        logConfig: MoEngageLogConfig = MoEngageLogConfig.defaultConfig(),
        analyticsConfig: MoEAnalyticsConfig = MoEAnalyticsConfig.defaultConfig()
    ) {
        this.pushConfig = pushConfig;
        this.logConfig = logConfig;
        this.analyticsConfig = analyticsConfig;
    }

    /**
     * Default Config for {@link MoEInitConfig}
     */
    static defaultConfig() {
        return new MoEInitConfig(
            MoEPushConfig.defaultConfig(),
            MoEngageLogConfig.defaultConfig(),
            MoEAnalyticsConfig.defaultConfig()
        );
    }
}