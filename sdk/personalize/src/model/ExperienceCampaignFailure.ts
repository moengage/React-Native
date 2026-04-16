import { ExperienceFailureReason } from "./ExperienceFailureReason";

/**
 * Represents a categorized failure for one or more experience campaigns within
 * a fetch result.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class ExperienceCampaignFailure {

  /**
   * Reason this group of experience campaigns failed.
   * @since 1.0.0
   */
  reason: ExperienceFailureReason;

  /**
   * List of experience keys that failed for this reason.
   * @since 1.0.0
   */
  experienceKeys: string[];

  constructor(reason: ExperienceFailureReason, experienceKeys: string[]) {
    this.reason = reason;
    this.experienceKeys = experienceKeys;
  }
}
