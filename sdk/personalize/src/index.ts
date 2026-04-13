import ExperienceCampaign from "./model/ExperienceCampaign";
import ExperienceCampaignFailure from "./model/ExperienceCampaignFailure";
import ExperienceCampaignMeta from "./model/ExperienceCampaignMeta";
import ExperienceCampaignsMetadata from "./model/ExperienceCampaignsMetadata";
import ExperienceCampaignsResult from "./model/ExperienceCampaignsResult";
import { DataSource } from "./model/DataSource";
import { ExperienceStatus } from "./model/ExperienceStatus";
import * as MoEPersonalizeHandler from "./internal/MoEPersonalizeHandler";

class ReactMoEngagePersonalize {
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  /**
   * Fetches experience campaign metadata filtered by status.
   *
   * @param statuses Array of {@link ExperienceStatus} to filter by.
   * @returns Promise resolving to {@link ExperienceCampaignsMetadata}.
   * @throws Rejects on SDK-level failures (SDK not initialized, network error, etc.).
   */
  fetchExperiencesMeta(statuses: ExperienceStatus[]): Promise<ExperienceCampaignsMetadata> {
    return MoEPersonalizeHandler.fetchExperiencesMeta(this.appId, statuses);
  }

  /**
   * Fetches a single experience campaign for the given key.
   *
   * @param experienceKey The experience key to fetch.
   * @param attributes Optional key-value attributes for personalization.
   * @returns Promise resolving to {@link ExperienceCampaignsResult}.
   * @throws Rejects on SDK-level failures (SDK not initialized, network error, etc.).
   */
  fetchExperience(
    experienceKey: string,
    attributes: Record<string, string> = {}
  ): Promise<ExperienceCampaignsResult> {
    return this.fetchExperiences([experienceKey], attributes);
  }

  /**
   * Fetches experience campaigns for the given keys and optional attributes.
   *
   * @param experienceKeys Array of experience keys to fetch.
   * @param attributes Optional key-value attributes for personalization.
   * @returns Promise resolving to {@link ExperienceCampaignsResult}.
   * @throws Rejects on SDK-level failures (SDK not initialized, network error, etc.).
   */
  fetchExperiences(
    experienceKeys: string[],
    attributes: Record<string, string> = {}
  ): Promise<ExperienceCampaignsResult> {
    return MoEPersonalizeHandler.fetchExperiences(this.appId, experienceKeys, attributes);
  }

  /**
   * Tracks impression events for one or more experience campaigns.
   *
   * @param campaigns Array of {@link ExperienceCampaign} that were shown.
   */
  trackExperienceShown(campaigns: ExperienceCampaign[]): void {
    MoEPersonalizeHandler.trackExperienceShown(this.appId, campaigns);
  }

  /**
   * Tracks a click event for a single experience campaign.
   *
   * @param campaign The {@link ExperienceCampaign} that was clicked.
   */
  trackExperienceClicked(campaign: ExperienceCampaign): void {
    MoEPersonalizeHandler.trackExperienceClicked(this.appId, campaign);
  }

  /**
   * Tracks impression events for one or more offerings.
   *
   * @param offeringAttributes Array of offering attribute dictionaries.
   */
  trackOfferingShown(offeringAttributes: Record<string, any>[]): void {
    MoEPersonalizeHandler.trackOfferingShown(this.appId, offeringAttributes);
  }

  /**
   * Tracks a click event for a single offering within an experience campaign.
   *
   * @param campaign The {@link ExperienceCampaign} containing the offering.
   * @param offeringAttributes The offering attribute dictionary that was clicked.
   */
  trackOfferingClicked(campaign: ExperienceCampaign, offeringAttributes: Record<string, any>): void {
    MoEPersonalizeHandler.trackOfferingClicked(this.appId, campaign, offeringAttributes);
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
};

export default ReactMoEngagePersonalize;
