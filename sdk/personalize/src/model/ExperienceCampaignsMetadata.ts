import { DataSource } from "./DataSource";
import ExperienceCampaignMeta from "./ExperienceCampaignMeta";

export default class ExperienceCampaignsMetadata {
  source: DataSource;
  experiences: ExperienceCampaignMeta[];

  constructor(source: DataSource, experiences: ExperienceCampaignMeta[]) {
    this.source = source;
    this.experiences = experiences;
  }
}
