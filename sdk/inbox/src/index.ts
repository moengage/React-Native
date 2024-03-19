import { Platform } from "react-native";
import MoEInboxData from "../src/model/MoEInboxData";
import MoEInboxMessage from "../src/model/MoEInboxMessage";
import MoETextContent from "../src/model/MoETextContent";
import MoEMedia from "../src/model/MoEMedia";
import MoEAction from "../src/model/MoEAction";
import * as MoEInboxRNiOS from "./platform/MoEInboxRNiOS";
import { fetchEmptyInboxModel } from "./utils/MoEInboxParser"
import { MoEInboxRNAndroid } from "./platform/MoEInboxRNAndroid";
import { getMoEInboxMessageJson } from "./utils/MoEInboxJsonBuilder";

const PLATFORM_ANDROID = "android";
const PLATFORM_iOS = "ios";
var moeAppId = "";
var MoEReactInbox = {

  initialize: function (appId:string) {
    moeAppId=appId;
  },

  fetchAllMessages: async function () {
    try {
      if (Platform.OS == PLATFORM_iOS) {
        return await MoEInboxRNiOS.fetchAllMessages(moeAppId);
      } else if (Platform.OS == PLATFORM_ANDROID) {
        return await MoEInboxRNAndroid.fetchAllMessages(moeAppId)
      }
    }
    catch (e) {
      return (fetchEmptyInboxModel());
    }
  },

  getUnClickedCount: async function () {
    try {
      if (Platform.OS == PLATFORM_iOS) {
        return await MoEInboxRNiOS.getUnClickedCount(moeAppId);
      } else if (Platform.OS == PLATFORM_ANDROID) {
        return await MoEInboxRNAndroid.getUnClickedCount(moeAppId);
      }
    }
    catch (e) {
      return 0
    }
  },

  trackMessageClicked: function (inboxMessage: MoEInboxMessage) {
    var json = getMoEInboxMessageJson(inboxMessage,moeAppId);
    if (Platform.OS == PLATFORM_iOS) {
      MoEInboxRNiOS.trackMessageClicked(json);
    } else if (Platform.OS == PLATFORM_ANDROID) {
      MoEInboxRNAndroid.trackMessageClicked(json)
    }
  },

  deleteMessage: function (inboxMessage: MoEInboxMessage) {
    var json = getMoEInboxMessageJson(inboxMessage,moeAppId);
    if (Platform.OS == PLATFORM_iOS) {
      MoEInboxRNiOS.deleteMessage(json);
    } else if (Platform.OS == PLATFORM_ANDROID) {
      MoEInboxRNAndroid.deleteMessage(json)
    }
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
