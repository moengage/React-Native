import ExperienceCampaign from "./ExperienceCampaign";
import ExperienceCampaignFailure from "./ExperienceCampaignFailure";

/**
 * Container for the result of `fetchExperiences` — the successfully fetched
 * campaigns plus any failures grouped by reason.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class ExperienceCampaignsResult {

  /**
   * Successfully fetched experience campaigns.
   * @since 1.0.0
   */
  experiences: ExperienceCampaign[];

  /**
   * Failures grouped by reason — each entry lists the experience keys that
   * failed for that reason.
   * @since 1.0.0
   */
  failures: ExperienceCampaignFailure[];

  constructor(experiences: ExperienceCampaign[], failures: ExperienceCampaignFailure[]) {
    this.experiences = experiences;
    this.failures = failures;
  }
}
