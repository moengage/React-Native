export default class ExperienceCampaignFailure {
  reason: string;
  experienceKeys: string[];
  message?: string | undefined;

  constructor(reason: string, experienceKeys: string[], message: string | undefined) {
    this.reason = reason;
    this.experienceKeys = experienceKeys;
    this.message = message;
  }
}
