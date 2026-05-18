/**
 * Error codes for JWT authentication failures.
 * String values match the @SerialName values in the Kotlin JwtErrorCode enum.
 *
 * @since 1.0.0
 */
enum MoEJwtErrorCode {
    TimeConstraintFailure = "TimeConstraintFailure",
    DecryptionFailed = "DecryptionFailed",
    HeaderTypeIncompatible = "HeaderTypeIncompatible",
    PayloadContentMissing = "PayloadContentMissing",
    InvalidSignature = "InvalidSignature",
    IdentifierMismatch = "IdentifierMismatch",
    Unknown = "Unknown",
    TokenNotAvailable = "TokenNotAvailable"
}

export default MoEJwtErrorCode;
