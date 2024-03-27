import { Platform } from "react-native";
import MoEInboxData from "../src/model/MoEInboxData";
import MoEInboxMessage from "../src/model/MoEInboxMessage";
import MoETextContent from "../src/model/MoETextContent";
import MoEMedia from "../src/model/MoEMedia";
import MoEAction from "../src/model/MoEAction";
import { fetchEmptyInboxModel } from "./utils/MoEInboxParser"
import * as MoEInboxHandler from "./utils/MoEInboxHandler";

var moeAppId = "";
var MoEReactInbox = {

  initialize: function (appId:string) {
    moeAppId=appId;
  },

  fetchAllMessages: async function () {
    try {
        return await MoEInboxHandler.fetchAllMessages(moeAppId);
      } catch(e) {
       return (fetchEmptyInboxModel());
      }
  },

  getUnClickedCount: async function () {
    try {
      return await MoEInboxHandler.getUnClickedCount(moeAppId);
    }
    catch (e) {
      return 0
    }
  },

  trackMessageClicked: function (inboxMessage: MoEInboxMessage) {
    MoEInboxHandler.trackMessageClicked(inboxMessage, moeAppId);
  },

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
