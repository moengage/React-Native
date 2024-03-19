import { getAppIdJson } from "../utils/MoEInboxJsonBuilder";
import { inboxDataFromJson, unClickedCountFromPayload } from "../utils/MoEInboxParser";

const MoEngageInbox = require("react-native").NativeModules.MoEngageInbox;

export class MoEInboxRNAndroid {
  
  static async getUnClickedCount(appId:string) {
    const countPayload =  await MoEngageInbox.getUnClickedCount(JSON.stringify(getAppIdJson(appId)))
    return unClickedCountFromPayload(countPayload)
  }

  static async fetchAllMessages(appId:string) {
    const messages = await MoEngageInbox.fetchAllMessages(JSON.stringify(getAppIdJson(appId)))
    return inboxDataFromJson(messages)
  }

  static trackMessageClicked(inboxMessage: object) {
    MoEngageInbox.trackMessageClicked(JSON.stringify(inboxMessage))
  }

  static deleteMessage(inboxMessage: object) {
    MoEngageInbox.deleteMessage(JSON.stringify(inboxMessage))
  }

}