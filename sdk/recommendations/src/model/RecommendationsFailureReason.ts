/**
 * Reason a recommendations request failed.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export enum RecommendationsFailureReason {
  /** The `recommendationId` was blank, or the server rejected the request — HTTP 400. */
  INVALID_REQUEST = "INVALID_REQUEST",

  /** The request exceeded the server's size limit — HTTP 413. */
  PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE",

  /** Fair-use-policy rate limit exceeded — HTTP 429. */
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  /** The server failed to process the request — HTTP 500. */
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",

  /** Recommendations is blocked from the dashboard, or disabled in the SDK configuration. */
  FEATURE_DISABLED = "FEATURE_DISABLED",

  /** The SDK is not initialized, or is not in a state that allows the operation. */
  SDK_STATE = "SDK_STATE",

  /** A network error occurred while making the request. */
  NETWORK_ERROR = "NETWORK_ERROR",

  /** The response could not be parsed. */
  PARSE_ERROR = "PARSE_ERROR",

  /** The server responded with an unhandled status code, or the failure could not be classified. */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Set of all known failure reasons. Used to validate reasons reported by the native layer and
 * fall back to `UNKNOWN_ERROR` for unknown values.
 *
 * @since 1.0.0
 */
export const KNOWN_FAILURE_REASONS: ReadonlySet<string> = new Set<string>([
  RecommendationsFailureReason.INVALID_REQUEST,
  RecommendationsFailureReason.PAYLOAD_TOO_LARGE,
  RecommendationsFailureReason.RATE_LIMIT_EXCEEDED,
  RecommendationsFailureReason.INTERNAL_SERVER_ERROR,
  RecommendationsFailureReason.FEATURE_DISABLED,
  RecommendationsFailureReason.SDK_STATE,
  RecommendationsFailureReason.NETWORK_ERROR,
  RecommendationsFailureReason.PARSE_ERROR,
  RecommendationsFailureReason.UNKNOWN_ERROR,
]);

/**
 * Maps a failure reason reported by the native layer to {@link RecommendationsFailureReason}.
 * Unknown values map to `UNKNOWN_ERROR` — the native reasons are not an exhaustive list, so a
 * reason this enum does not model must not break the caller.
 *
 * @since 1.0.0
 */
export function recommendationsFailureReasonFromString(value: unknown): RecommendationsFailureReason {
  if (typeof value === "string" && KNOWN_FAILURE_REASONS.has(value)) {
    return value as RecommendationsFailureReason;
  }
  return RecommendationsFailureReason.UNKNOWN_ERROR;
}
