import { getAppIdJson, getMoEInboxMessageJson } from "../utils/MoEInboxJsonBuilder";
import { fetchEmptyInboxModel, inboxDataFromJson, unClickedCountFromPayload } from "../utils/MoEInboxParser"
import MoEngageReactInbox from "../NativeMoEngageInbox";
import MoEInboxMessage from "../../src/model/MoEInboxMessage";

export const fetchAllMessages = async (appId: string) => {
  try {
    const inboxMessages = await MoEngageReactInbox.fetchAllMessages(getAppIdJson(appId));
    return inboxDataFromJson(inboxMessages)
  } catch (error) {
    return fetchEmptyInboxModel();
  }
}

export const getUnClickedCount = async (appId: string) => {
  try {
    const countPayload = await MoEngageReactInbox.getUnClickedCount(getAppIdJson(appId));
    return unClickedCountFromPayload(countPayload)
  } catch (error) {
    return 0;
  }
}

export function trackMessageClicked(inboxMessage: MoEInboxMessage, appId: string) {
  let payload = getMoEInboxMessageJson(inboxMessage, appId);
  MoEngageReactInbox.trackMessageClicked(payload)
}

export function deleteMessage(inboxMessage: MoEInboxMessage, appId: string) {
  let payload = getMoEInboxMessageJson(inboxMessage, appId);
  MoEngageReactInbox.deleteMessage(payload)
}
