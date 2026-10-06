import { MoEngageFailureReason } from "./MoEngageFailureReason";

/**
 * Failure details of a request to the SDK.
 *
 * @since 13.1.0
 */
export default class MoERequestFailure {

    /**
     * Reason the request failed.
     */
    reason: MoEngageFailureReason;

    /**
     * Human readable description of the failure.
     */
    message: string;

    constructor(reason: MoEngageFailureReason, message: string) {
        this.reason = reason;
        this.message = message;
    }
}
