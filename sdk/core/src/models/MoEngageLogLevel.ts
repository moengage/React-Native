/**
 * Different Log Level Supported by the {@link MoEngageLogConfig}
 */
const enum MoEngageLogLevel {

    /**
     * No logs from the SDK would be printed.
     */
    NO_LOG = 0,

    /**
     * Error logs from the SDK would be printed.
     */
    ERROR = 1,

    /**
     * Warning logs from the SDK would be printed.
     */
    WARN = 2,

    /**
     * Info logs from the SDK would be printed.
     */
    INFO = 3,

    /**
     * Debug logs from the SDK would be printed.
     */
    DEBUG = 4,

    /**
     * Verbose logs from the SDK would be printed.
     */
    VERBOSE = 5
}

export default MoEngageLogLevel;