import { RecommendationsFailureReason } from "./RecommendationsFailureReason";

/**
 * Failure raised by a recommendations request. The fetch APIs reject with this.
 *
 * An empty item list is a success, not a failure — it means there are no recommendations for
 * this user.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class RecommendationsFailure {

  /**
   * Reason for the failure.
   * @since 1.0.0
   */
  failureReason: RecommendationsFailureReason;

  /**
   * Failure message.
   * @since 1.0.0
   */
  message: string;

  constructor(failureReason: RecommendationsFailureReason, message: string) {
    this.failureReason = failureReason;
    this.message = message;
  }
}
