export default class MoECampaignContext {
     formattedCampaignId:string;
     attributes: Map<String, Object>;
  
    constructor(formattedCampaignId: string, attributes:  Map<String, Object>) {
      this.formattedCampaignId = formattedCampaignId;
      this.attributes = attributes;
    }
  
  }