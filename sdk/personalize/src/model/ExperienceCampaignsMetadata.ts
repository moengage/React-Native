import { DataSource } from "./DataSource";
import ExperienceCampaignMeta from "./ExperienceCampaignMeta";

/**
 * Container for the result of `fetchExperiencesMeta` — the source of the data
 * and the list of experience metadata entries.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class ExperienceCampaignsMetadata {

  /**
   * Source from which the metadata was retrieved (cache or network).
   * @since 1.0.0
   */
  source: DataSource;

  /**
   * List of experience metadata entries.
   * @since 1.0.0
   */
  experiences: ExperienceCampaignMeta[];

  constructor(source: DataSource, experiences: ExperienceCampaignMeta[]) {
    this.source = source;
    this.experiences = experiences;
  }
}
