import { getAppIdJson } from "../utils/MoEInboxJsonBuilder";
import { inboxDataFromJson, unClickedCountFromPayload } from "../utils/MoEInboxParser"
const MoEngageInbox = require("react-native").NativeModules.MoEReactInbox;

export const fetchAllMessages = (appId: string) => {
  return new Promise((resolve, reject) => {
    MoEngageInbox.fetchAllMessages(getAppIdJson(appId)).then((inboxMessages: string) => {
      resolve(inboxDataFromJson(inboxMessages));
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export const getUnClickedCount = (appId:string) => {
  return new Promise((resolve, reject) => {
    MoEngageInbox.getUnClickedCount(getAppIdJson(appId)).then((countPayload: string) => {
      resolve(unClickedCountFromPayload(countPayload));
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export function trackMessageClicked(inboxInfo: Object) {
  MoEngageInbox.trackMessageClicked(inboxInfo)
}

export function deleteMessage(inboxInfo: Object) {
  MoEngageInbox.deleteMessage(inboxInfo)
}
