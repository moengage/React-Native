import MoEAction from "./MoEAction";
import { MoEActionType } from "./MoEActionType";

export default class MoEInAppCustomAction extends MoEAction{
  keyValuePair: Map<String, Object>;
  actionType: MoEActionType;

  constructor(keyValuePair: Map<String, Object>, actionType: MoEActionType) {
    super();
    this.keyValuePair = keyValuePair;
    this.actionType = actionType
  }

}
