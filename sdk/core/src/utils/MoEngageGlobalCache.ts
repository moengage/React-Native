import MoEInitConfig from "../models/MoEInitConfig";

/**
 * In Memory Cache for Plugin
 */
namespace MoEngageGlobalCache {

    /**
     * Plugin Init Config
     */
    let initConfig: MoEInitConfig = MoEInitConfig.defaultConfig();

    export function updateInitConfig(updatedConfig: MoEInitConfig) {
        initConfig = updatedConfig;
    }

    export function getInitConfig(): MoEInitConfig {
        return initConfig;
    }
}

export default MoEngageGlobalCache;