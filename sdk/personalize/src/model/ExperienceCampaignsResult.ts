import ExperienceCampaign from "./ExperienceCampaign";
import ExperienceCampaignFailure from "./ExperienceCampaignFailure";

export default class ExperienceCampaignsResult {
  experiences: ExperienceCampaign[];
  failures: ExperienceCampaignFailure[];

  constructor(experiences: ExperienceCampaign[], failures: ExperienceCampaignFailure[]) {
    this.experiences = experiences;
    this.failures = failures;
  }
}
