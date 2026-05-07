import { ExperienceStatus } from "./ExperienceStatus";

/**
 * Lightweight metadata for an experience campaign returned by `fetchExperiencesMeta`.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class ExperienceCampaignMeta {

  /**
   * Unique identifier for the experience.
   * @since 1.0.0
   */
  experienceKey: string;

  /**
   * Human-readable name of the experience campaign.
   * @since 1.0.0
   */
  experienceName: string;

  /**
   * Current status of the experience campaign.
   * @since 1.0.0
   */
  status: ExperienceStatus;

  constructor(experienceKey: string, experienceName: string, status: ExperienceStatus) {
    this.experienceKey = experienceKey;
    this.experienceName = experienceName;
    this.status = status;
  }
}
