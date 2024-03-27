import { getAppIdJson, getMoEInboxMessageJson } from "../utils/MoEInboxJsonBuilder";
import { inboxDataFromJson, unClickedCountFromPayload } from "../utils/MoEInboxParser"
import MoEngageReactInbox from "../NativeMoEngageInbox";
import MoEInboxMessage from "react-native-moengage-inbox/src/model/MoEInboxMessage";


export const fetchAllMessages = (appId: string) => {
  return new Promise((resolve, reject) => {
    MoEngageReactInbox.fetchAllMessages(getAppIdJson(appId)).then((inboxMessages: Object) => {
      resolve(inboxDataFromJson(inboxMessages));
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export const getUnClickedCount = (appId:string) => {
  return new Promise((resolve, reject) => {
    MoEngageReactInbox.getUnClickedCount(getAppIdJson(appId)).then((countPayload: Object) => {
      resolve(unClickedCountFromPayload(countPayload));
    }).catch((error: any) => {
      reject(error);
    });
  });
}

export function trackMessageClicked(inboxMessage: MoEInboxMessage, appId: string) {
  let payload = getMoEInboxMessageJson(inboxMessage,appId);
  MoEngageReactInbox.trackMessageClicked(payload)
}

export function deleteMessage(inboxMessage: MoEInboxMessage, appId: string) {
  let payload = getMoEInboxMessageJson(inboxMessage,appId);
  MoEngageReactInbox.deleteMessage(payload)
}
