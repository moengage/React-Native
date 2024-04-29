import MoEInboxData from "../src/model/MoEInboxData";
import MoEInboxMessage from "../src/model/MoEInboxMessage";
import MoETextContent from "../src/model/MoETextContent";
import MoEMedia from "../src/model/MoEMedia";
import MoEAction from "../src/model/MoEAction";
import { fetchEmptyInboxModel } from "./utils/MoEInboxParser"
import * as MoEInboxHandler from "./utils/MoEInboxHandler";

var moeAppId = "";
var MoEReactInbox = {

  initialize: function (appId: string) {
    moeAppId = appId;
  },

  /**
   * API to fetch all the inbox messages.
   * 
   * @returns instance of {@link MoEInboxData}
   * 
   */
  fetchAllMessages: async function () {
    try {
      return await MoEInboxHandler.fetchAllMessages(moeAppId);
    } catch (e) {
      return (fetchEmptyInboxModel());
    }
  },

  /**
   * 
   * API to get the count of unclicked inbox messages.
   * 
   * @returns Unclicked message count.
   * 
   */
  getUnClickedCount: async function () {
    try {
      return await MoEInboxHandler.getUnClickedCount(moeAppId);
    }
    catch (e) {
      return 0
    }
  },

  /**
   * API to track the click on inbox message.
   * 
   * @param inboxMessage instance of {@link MoEInboxMessage}
   */
  trackMessageClicked: function (inboxMessage: MoEInboxMessage) {
    MoEInboxHandler.trackMessageClicked(inboxMessage, moeAppId);
  },

  /**
    * API to delete a particular message from the list of messages
    * 
    * @param inboxMessage instance of {@link MoEInboxMessage}
    */
  deleteMessage: function (inboxMessage: MoEInboxMessage) {
    MoEInboxHandler.deleteMessage(inboxMessage, moeAppId);
  }
};

export {
  MoEInboxData,
  MoEInboxMessage,
  MoETextContent,
  MoEMedia,
  MoEAction,
};

export default MoEReactInbox;
