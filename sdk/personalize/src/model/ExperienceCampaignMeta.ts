import { ExperienceStatus } from "./ExperienceStatus";

export default class ExperienceCampaignMeta {
  experienceKey: string;
  experienceName: string;
  status: ExperienceStatus;

  constructor(experienceKey: string, experienceName: string, status: ExperienceStatus) {
    this.experienceKey = experienceKey;
    this.experienceName = experienceName;
    this.status = status;
  }
}
