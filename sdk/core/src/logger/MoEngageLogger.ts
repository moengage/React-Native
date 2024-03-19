import MoEngageLogLevel from "../models/MoEngageLogLevel";
import MoEngageGlobalCache from "../utils/MoEngageGlobalCache";

/**
 * Logger to print the ReactNative Plugin log
 * Notes: To Configure the log check {@link MoEInitConfig}
 */
namespace MoEngageLogger {

    function isLoggable(logLevel: MoEngageLogLevel): boolean {
        return (__DEV__ || MoEngageGlobalCache.getInitConfig().logConfig.isEnabledForReleaseBuild)
            && MoEngageGlobalCache.getInitConfig().logConfig.logLevel >= logLevel;
    }

    /**
     * Console error log
     * 
     * @param {any} message - log message which need to be logged
     * @param {any} data - additional message or data
     */
    export function error(message: any, data?: any): void {
        if (!isLoggable(MoEngageLogLevel.ERROR)) return;
        if (data === undefined) console.error(message);
        else console.error(message, data);
    }

    /**
     * Console warn log
     * 
     * @param {any} message - log message which need to be logged
     * @param {any} data - additional message or data
     */
    export function warn(message: any, data?: any): void {
        if (!isLoggable(MoEngageLogLevel.WARN)) return;
        if (data === undefined) console.warn(message);
        else console.warn(message, data);
    }

    /**
     * Console info log
     * 
     * @param {any} message - log message which need to be logged
     * @param {any} data - additional message or data
     */
    export function info(message: any, data?: any): void {
        if (!isLoggable(MoEngageLogLevel.INFO)) return;
        if (data === undefined) console.info(message);
        else console.info(message, data);
    }

    /**
     * Console debug log
     * 
     * @param {any} message - log message which need to be logged
     * @param {any} data - additional message or data
     */
    export function debug(message: any, data?: any): void {
        if (!isLoggable(MoEngageLogLevel.DEBUG)) return;
        if (data === undefined) console.debug(message);
        else console.debug(message, data);
    }

    /**
     * Console verbose log
     * Notes: On Console it will be clubbed with debug log
     * 
     * @param {any} message - log message which need to be logged
     * @param {any} data - additional message or data
     */
    export function verbose(message: any, data?: any): void {
        if (!isLoggable(MoEngageLogLevel.VERBOSE)) return;
        if (data === undefined) console.debug(message);
        else console.debug(message, data);
    }
}

export default MoEngageLogger;