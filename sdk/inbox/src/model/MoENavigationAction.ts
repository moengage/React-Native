export default class MoENavigationAction {
  navigationType: string;
  value: string;
  kvPair?: Map<String, Object> | undefined;
  constructor(navigationType: string, value: string, kvPair: Map<String, Object> | undefined) {
    this.navigationType = navigationType;
    this.value = value;
    this.kvPair = kvPair;
  }
}