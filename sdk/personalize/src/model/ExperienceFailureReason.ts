/**
 * Server-side failure reasons for an experience campaign fetch. Mirrors the
 * `ExperienceFailureReason` enum in the contract proto.
 *
 * SDK-level errors (network errors, SDK not initialized, etc.) surface via
 * `Promise.reject` from the fetch APIs and are not part of this union.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export type ExperienceFailureReason =
    | "USER_IN_CAMPAIGN_CONTROL_GROUP"
    | "USER_IN_GLOBAL_CONTROL_GROUP"
    | "USER_NOT_IN_SEGMENT"
    | "IN_VALID_EXPERIENCE_KEY"
    | "MAX_LIMIT_BREACHED"
    | "EXPERIENCE_NOT_ACTIVE"
    | "EXPERIENCE_EXPIRED"
    | "PERSONALIZATION_FAILED";

/**
 * Set of all known failure reasons. Used by the parser to validate incoming
 * values and fall back to `PERSONALIZATION_FAILED` for unknown values.
 *
 * @since 1.0.0
 */
export const KNOWN_FAILURE_REASONS: ReadonlySet<ExperienceFailureReason> = new Set([
    "USER_IN_CAMPAIGN_CONTROL_GROUP",
    "USER_IN_GLOBAL_CONTROL_GROUP",
    "USER_NOT_IN_SEGMENT",
    "IN_VALID_EXPERIENCE_KEY",
    "MAX_LIMIT_BREACHED",
    "EXPERIENCE_NOT_ACTIVE",
    "EXPERIENCE_EXPIRED",
    "PERSONALIZATION_FAILED",
]);
