/**
 * Reason a request to the SDK failed.
 *
 * @since 13.1.0
 */
export enum MoERequestFailureReason {
    /** The parameters provided to the method were invalid. */
    InvalidParameters = "INVALID_PARAMETERS",

    /** The configuration used for SDK initialization was invalid. */
    InvalidInitialisationConfiguration = "INVALID_INITIALISATION_CONFIGURATION",

    /** The SDK is not in a valid state to perform the operation (e.g., not initialized). */
    SdkState = "SDK_STATE",

    /** The feature is disabled in the SDK configuration or from the dashboard. */
    FeatureDisabled = "FEATURE_DISABLED",

    /** An unknown or unexpected error occurred. */
    UnknownError = "UNKNOWN_ERROR"
}
