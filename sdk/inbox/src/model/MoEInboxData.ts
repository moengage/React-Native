import MoEInboxMessage from './MoEInboxMessage'
import { MoEPlatform } from './MoEPlatform';

export default class MoEInboxData {
  platform: MoEPlatform;
  messages: MoEInboxMessage[];

  constructor(platform: MoEPlatform, messages: MoEInboxMessage[]) {
    this.platform = platform;
    this.messages = messages;
  }
}
