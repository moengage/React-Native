export default class MoESelfHandledCampaign {
    payload: string;
    dismissInterval: Number;

    constructor(payload: string, dismissInterval: Number) {
        this.payload = payload;
        this.dismissInterval = dismissInterval;
    }

}