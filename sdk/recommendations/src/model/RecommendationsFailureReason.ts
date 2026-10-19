import { MoEngageFailureReason } from "react-native-moengage";

/**
 * Failure reasons specific to recommendations, on top of {@link MoEngageFailureReason}.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export enum RecommendationsSpecificFailureReason {
  /** The `recommendationId` was blank, or the server rejected the request — HTTP 400. */
  INVALID_REQUEST = "INVALID_REQUEST",

  /** The request exceeded the server's size limit — HTTP 413. */
  PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE",

  /** Fair-use-policy rate limit exceeded — HTTP 429. */
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  /** The server failed to process the request — HTTP 500. */
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

/**
 * Reason a recommendations request failed: every {@link MoEngageFailureReason}
 * (`SDK_STATE`, `FEATURE_DISABLED`, `NETWORK_ERROR`, `PARSE_ERROR`, `INVALID_PARAMETERS`,
 * `SERVER_ERROR`, `AUTHENTICATION_FAILED`, `UNKNOWN_ERROR`) plus the
 * {@link RecommendationsSpecificFailureReason} values.
 *
 * TypeScript enums cannot extend one another, so this is a frozen object combining both enums,
 * paired with a same-named union type — use it exactly like an enum
 * (e.g. `RecommendationsFailureReason.RATE_LIMIT_EXCEEDED`).
 *
 * @author MoEngage
 * @since 1.0.0
 */
export const RecommendationsFailureReason = Object.freeze({
  ...MoEngageFailureReason,
  ...RecommendationsSpecificFailureReason,
});

export type RecommendationsFailureReason =
  | MoEngageFailureReason
  | RecommendationsSpecificFailureReason;

/**
 * Set of all known failure reasons. Used to validate reasons reported by the native layer and
 * fall back to `UNKNOWN_ERROR` for unknown values.
 *
 * @since 1.0.0
 */
export const KNOWN_FAILURE_REASONS: ReadonlySet<string> = new Set<string>(
  Object.values(RecommendationsFailureReason)
);

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
