import { MoEActionType } from "./MoEActionType";

export default class MoEAction {
  actionType: MoEActionType;
  navigationType: string;
  value: string;
  kvPair?: Map<String, Object> | undefined;
  constructor(actionType: MoEActionType, navigationType: string, value: string, kvPair: Map<String, Object> | undefined) {
    this.actionType = actionType
    this.navigationType = navigationType;
    this.value = value;
    this.kvPair = kvPair;
  }
}
