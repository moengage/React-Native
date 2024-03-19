import {
    DEFAULT_CONFIG_LOG_LEVEL,
    DEFAULT_CONFIG_RELEASE_BUILD_LOG_ENABLED
} from "../utils/MoEConstants";
import MoEngageLogLevel from "./MoEngageLogLevel";

/**
 * Config class to configure the React-Native Plugin log.
 * Notes: To configure Native Module log check on Android / iOS initialisation config.
 */
export default class MoEngageLogConfig {

    logLevel: MoEngageLogLevel = DEFAULT_CONFIG_LOG_LEVEL;

    isEnabledForReleaseBuild: boolean = DEFAULT_CONFIG_RELEASE_BUILD_LOG_ENABLED;

    /**
     * Create an instance for MoEngageLogConfig
     * 
     * @param logLevel - Min log level which need to be printed on console
     * @param isEnabledForReleaseBuild - enable / disable the log in release build
     */
    constructor(logLevel: MoEngageLogLevel, isEnabledForReleaseBuild: boolean) {
        this.logLevel = logLevel;
        this.isEnabledForReleaseBuild = isEnabledForReleaseBuild;
    }

    /**
     * Default config for the log
     */
    static defaultConfig() {
        return new MoEngageLogConfig(DEFAULT_CONFIG_LOG_LEVEL, DEFAULT_CONFIG_RELEASE_BUILD_LOG_ENABLED);
    }
}