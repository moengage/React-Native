/**
 * Reason a request to the SDK failed.
 *
 * @since 13.1.0
 */
export enum MoERequestFailureReason {
    InvalidParameters = "INVALID_PARAMETERS",
    InvalidInitialisationConfiguration = "INVALID_INITIALISATION_CONFIGURATION",
    SdkState = "SDK_STATE",
    UnknownError = "UNKNOWN_ERROR"
}
