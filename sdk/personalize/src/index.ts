import ExperienceCampaign from "./model/ExperienceCampaign";
import ExperienceCampaignFailure from "./model/ExperienceCampaignFailure";
import ExperienceCampaignMeta from "./model/ExperienceCampaignMeta";
import ExperienceCampaignsMetadata from "./model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "./model/ExperienceCampaignsResult";
import { DataSource } from "./model/DataSource";
import { ExperienceStatus } from "./model/ExperienceStatus";
import { ExperienceFailureReason } from "./model/ExperienceFailureReason";
import MoEngagePersonalizeHandler from "./internal/MoEngagePersonalizeHandler";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG } from "./internal/Constants";

/**
 * Public API for the MoEngage Personalize Experience module. Each instance is
 * scoped to a single MoEngage workspace (app id) — multiple workspaces should
 * each instantiate their own.
 *
 * @author MoEngage
 * @since 1.0.0
 */
class ReactMoEngagePersonalize {

  private readonly TAG = `${MODULE_TAG}ReactMoEngagePersonalize`;

  private handler: MoEngagePersonalizeHandler;

  /**
   * Construct a personalize instance for the given workspace.
   *
   * @param appId The MoEngage workspace identifier.
   * @since 1.0.0
   */
  constructor(appId: string) {
    MoEngageLogger.debug(`${this.TAG} constructor() : appId=${appId}`);
    this.handler = new MoEngagePersonalizeHandler(appId);
  }

  /**
   * Fetches experience campaign metadata filtered by status.
   *
   * @param statuses Array of {@link ExperienceStatus} to filter by.
   * @returns Promise resolving to {@link ExperienceCampaignsMetadata}.
   * @throws Rejects on SDK-level failures (SDK not initialized, network error, etc.).
   * @since 1.0.0
   */
  fetchExperiencesMeta(statuses: ExperienceStatus[]): Promise<ExperienceCampaignsMetadata> {
    MoEngageLogger.verbose(`${this.TAG} fetchExperiencesMeta() : `);
    return this.handler.fetchExperiencesMeta(statuses);
  }

  /**
   * Fetches a single experience campaign for the given key.
   *
   * @param experienceKey The experience key to fetch.
   * @param attributes Optional key-value attributes for personalization.
   * @returns Promise resolving to {@link ExperienceCampaignsResult}.
   * @throws Rejects on SDK-level failures.
   * @since 1.0.0
   */
  fetchExperience(
    experienceKey: string,
    attributes: Record<string, string> = {}
  ): Promise<ExperienceCampaignsResult> {
    MoEngageLogger.verbose(`${this.TAG} fetchExperience() : `);
    return this.fetchExperiences([experienceKey], attributes);
  }

  /**
   * Fetches experience campaigns for the given keys and optional attributes.
   *
   * @param experienceKeys Array of experience keys to fetch.
   * @param attributes Optional key-value attributes for personalization.
   * @returns Promise resolving to {@link ExperienceCampaignsResult}.
   * @throws Rejects on SDK-level failures.
   * @since 1.0.0
   */
  fetchExperiences(
    experienceKeys: string[],
    attributes: Record<string, string> = {}
  ): Promise<ExperienceCampaignsResult> {
    MoEngageLogger.verbose(`${this.TAG} fetchExperiences() : `);
    return this.handler.fetchExperiences(experienceKeys, attributes);
  }

  /**
   * Tracks impression events for one or more experience campaigns.
   *
   * @param campaigns Array of {@link ExperienceCampaign} that were shown.
   * @since 1.0.0
   */
  experiencesShown(campaigns: ExperienceCampaign[]): void {
    MoEngageLogger.verbose(`${this.TAG} experiencesShown() : `);
    this.handler.experiencesShown(campaigns);
  }

  /**
   * Tracks an impression event for a single experience campaign.
   *
   * @param campaign The {@link ExperienceCampaign} that was shown.
   * @since 1.0.0
   */
  experienceShown(campaign: ExperienceCampaign): void {
    MoEngageLogger.verbose(`${this.TAG} experienceShown() : `);
    this.experiencesShown([campaign]);
  }

  /**
   * Tracks a click event for a single experience campaign.
   *
   * @param campaign The {@link ExperienceCampaign} that was clicked.
   * @since 1.0.0
   */
  experienceClicked(campaign: ExperienceCampaign): void {
    MoEngageLogger.verbose(`${this.TAG} experienceClicked() : `);
    this.handler.experienceClicked(campaign);
  }

  /**
   * Tracks impression events for one or more offerings.
   *
   * @param offeringPayloads Array of full offering payload dictionaries.
   * @since 1.0.0
   */
  offeringsShown(offeringPayloads: Record<string, any>[]): void {
    MoEngageLogger.verbose(`${this.TAG} offeringsShown() : `);
    this.handler.offeringsShown(offeringPayloads);
  }

  /**
   * Tracks an impression event for a single offering.
   *
   * @param offeringPayload The full offering payload dictionary that was shown.
   * @since 1.0.0
   */
  offeringShown(offeringPayload: Record<string, any>): void {
    MoEngageLogger.verbose(`${this.TAG} offeringShown() : `);
    this.offeringsShown([offeringPayload]);
  }

  /**
   * Tracks a click event for a single offering within an experience campaign.
   *
   * @param campaign The {@link ExperienceCampaign} containing the offering.
   * @param offeringPayload The full offering payload dictionary that was clicked.
   * @since 1.0.0
   */
  offeringClicked(campaign: ExperienceCampaign, offeringPayload: Record<string, any>): void {
    MoEngageLogger.verbose(`${this.TAG} offeringClicked() : `);
    this.handler.offeringClicked(campaign, offeringPayload);
  }
}

export {
  ExperienceCampaign,
  ExperienceCampaignFailure,
  ExperienceCampaignMeta,
  ExperienceCampaignsMetadata,
  ExperienceCampaignsResult,
  DataSource,
  ExperienceStatus,
  ExperienceFailureReason,
};

export default ReactMoEngagePersonalize;
