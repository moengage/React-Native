export default class MoEPushCampaign {
  payload: Map<String, Object>;
  isDefaultAction: Boolean;
  clickAction: Map<String, Object>;
  selfHandledPushRedirection: boolean;

  constructor(payload: Map<String, Object>, isDefaultAction: Boolean, clickAction: Map<String, Object>, selfHandledPushRedirection: boolean) {
    this.payload = payload;
    this.isDefaultAction = isDefaultAction;
    this.clickAction = clickAction;
    this.selfHandledPushRedirection = selfHandledPushRedirection;
  }
}
