/**
 * Common failure reasons shared across MoEngage modules. Feature modules extend this set with
 * their own feature-specific reasons.
 *
 * @author MoEngage
 * @since 13.0.0
 */
export enum MoEngageFailureReason {
  /** The SDK is not initialized, or is not in a state that allows the operation. */
  SDK_STATE = "SDK_STATE",

  /** The feature is blocked from the dashboard, or disabled in the SDK configuration. */
  FEATURE_DISABLED = "FEATURE_DISABLED",

  /** A network error occurred while making the request. */
  NETWORK_ERROR = "NETWORK_ERROR",

  /** The response could not be parsed. */
  PARSE_ERROR = "PARSE_ERROR",

  /** One or more parameters passed to the API are invalid. */
  INVALID_PARAMETERS = "INVALID_PARAMETERS",

  /** The configuration used to initialise the SDK does not support the request. */
  INVALID_INITIALISATION_CONFIGURATION = "INVALID_INITIALISATION_CONFIGURATION",

  /** The server failed to process the request. */
  SERVER_ERROR = "SERVER_ERROR",

  /** The API was called again before the earlier call completed; only the last call is processed. */
  DUPLICATE_FUNCTION_CALL = "DUPLICATE_FUNCTION_CALL",

  /** The request could not be authenticated. */
  AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",

  /** The failure could not be classified. */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}
