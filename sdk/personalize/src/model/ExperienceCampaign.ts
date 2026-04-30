import { DataSource } from "./DataSource";

/**
 * Holds the data for a single experience campaign returned by the personalization
 * service.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class ExperienceCampaign {

  /**
   * Unique identifier for the experience.
   * @since 1.0.0
   */
  experienceKey: string;

  /**
   * The JSON payload for the experience campaign.
   * @since 1.0.0
   */
  payload: Record<string, any>;

  /**
   * Metadata describing the experience campaign (campaign id, audience, locale, etc.).
   * @since 1.0.0
   */
  experienceContext: Record<string, string>;

  /**
   * Source from which the campaign was retrieved (cache or network).
   * @since 1.0.0
   */
  source: DataSource;

  constructor(
    experienceKey: string,
    payload: Record<string, any>,
    experienceContext: Record<string, string>,
    source: DataSource
  ) {
    this.experienceKey = experienceKey;
    this.payload = payload;
    this.experienceContext = experienceContext;
    this.source = source;
  }
}
