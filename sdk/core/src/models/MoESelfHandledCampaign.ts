import MoEInAppRules from "../models/MoEInAppRules";

export default class MoESelfHandledCampaign {
    payload: string;
    dismissInterval: Number;
    displayRules: MoEInAppRules

    constructor(payload: string, dismissInterval: Number, displayRules: MoEInAppRules) {
        this.payload = payload;
        this.dismissInterval = dismissInterval;
        this.displayRules = displayRules;
    }
}