import MoEAction from "./MoEAction";
import { MoEActionType } from "./MoEActionType";
import { MoENavigationType } from "./MoENavigationType";

export default class MoEInAppNavigation extends MoEAction {
  navigationType: MoENavigationType;
  navigationUrl: String;
  keyValuePair?: Map<String, Object>;
  actionType :MoEActionType;

  constructor(navigationType: MoENavigationType, navigationUrl: String, keyValuePair: Map<String, Object>,actionType:MoEActionType) {
    super();
    this.navigationType = navigationType;
    this.navigationUrl = navigationUrl;
    this.keyValuePair = keyValuePair;
    this.actionType = actionType;
  }

}
