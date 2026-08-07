/**
 * Error codes reported when JWT authentication fails.
 *
 * @since 12.10.0
 */
export enum MoEJwtErrorCode {
    TimeConstraintFailure = "TIME_CONSTRAINT_FAILURE",
    DecryptionFailed = "DECRYPTION_FAILED",
    HeaderTypeIncompatible = "HEADER_TYPE_INCOMPATIBLE",
    PayloadContentMissing = "PAYLOAD_CONTENT_MISSING",
    InvalidSignature = "INVALID_SIGNATURE",
    IdentifierMismatch = "IDENTIFIER_MISMATCH",
    Unknown = "UNKNOWN",
    TokenNotAvailable = "TOKEN_NOT_AVAILABLE"
}
