import { DataSource } from "./DataSource";

export default class ExperienceCampaign {
  experienceKey: string;
  payload: Record<string, any>;
  experienceContext: Record<string, any>;
  source: DataSource;

  constructor(
    experienceKey: string,
    payload: Record<string, any>,
    experienceContext: Record<string, any>,
    source: DataSource
  ) {
    this.experienceKey = experienceKey;
    this.payload = payload;
    this.experienceContext = experienceContext;
    this.source = source;
  }
}
