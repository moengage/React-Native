import { Platform } from "react-native";
import MoEInboxData from "../model/MoEInboxData";
import MoEInboxMessage from "../model/MoEInboxMessage";
import MoETextContent from "../model/MoETextContent";
import MoEMedia from "../model/MoEMedia";
import MoEAction from "../model/MoEAction";
import * as InboxConstants from "../utils/MoEInboxConstants"
import { isValidObject, isValidString, isValidNumber } from "../utils/MoEInboxHelper";
import { MoEPlatform } from "../model/MoEPlatform";
import { MOE_DATA } from "../utils/MoEInboxConstants"
const PLATFORM = 'platform'
const UNCLICKED_COUNT = 'unClickedCount'

export function inboxDataFromJson(payload: string) {
  const inboxJSON = JSON.parse(payload);
  const inboxData = inboxJSON[InboxConstants.MOE_DATA]
  var platform;
  var messageList: MoEInboxMessage[] = [];

  if (isValidObject(inboxData)) {

    platform = inboxData[PLATFORM];

    var messages = inboxData[InboxConstants.MESSAGES];
    for (var message of messages) {
      var inboxMessage = inboxMessageFromJson(message);
      if (inboxMessage != null)
        messageList.push(inboxMessage);
    }
  }
  if (platform != undefined)
    return new MoEInboxData(platform, messageList)
  return undefined;
}

export function inboxMessageFromJson(message: { [k: string]: any }) {
  if (message != undefined) {
    var id;
    var campaignId;
    var isClicked;
    var receivedTime;
    var expiry;
    var tag;
    var textContent;
    var actionList: Array<MoEAction> = [];
    var media;
    var payload;
    var groupKey;
    var notificationId;
    var sentTime;

    campaignId = message[InboxConstants.CAMPAIGN_ID];
    isClicked = message[InboxConstants.IS_CLICKED];
    receivedTime = message[InboxConstants.RECEIVED_TIME];
    expiry = message[InboxConstants.EXPIRY];
    var actions = message[InboxConstants.ACTION];

    if (isValidNumber(message[InboxConstants.ID])) {
      id = message[InboxConstants.ID];
    }
    if (isValidString(message[InboxConstants.TAG])) {
      tag = message[InboxConstants.TAG];
    }

    textContent = textContentFromJson(message[InboxConstants.TEXT]);
    for (var action of actions) {
      var moEAction = actionModelFromJson(action)
      moEAction ?
        actionList.push(moEAction) : null;
    }
    if (isValidObject(message[InboxConstants.MEDIA])) {
      media = mediaModelFromJson(message[InboxConstants.MEDIA]);
    }

    if (isValidObject(message[InboxConstants.PAYLOAD])) {
      payload = message[InboxConstants.PAYLOAD];
    }
    if (isValidString(message[InboxConstants.GROUP_KEY])) {
      groupKey = message[InboxConstants.GROUP_KEY];
    }
    if (isValidString(message[InboxConstants.NOTIFICATION_ID])) {
      notificationId = message[InboxConstants.NOTIFICATION_ID];
    }
    if (isValidString(message[InboxConstants.SENT_TIME])) {
      sentTime = message[InboxConstants.SENT_TIME];
    }
    if (campaignId != undefined && textContent != undefined && isClicked != undefined && receivedTime != undefined && expiry != undefined && payload != undefined)
      return new MoEInboxMessage(id, campaignId, textContent, isClicked, media, actionList, tag, receivedTime, expiry, payload, groupKey, notificationId, sentTime);
    else
      return undefined;

  }
  else return undefined;

}

function mediaModelFromJson(mediaObject: { [k: string]: any }) {
  var mediaType;
  var url
  if (isValidString(mediaObject[InboxConstants.TYPE])) {
    mediaType = mediaObject[InboxConstants.TYPE];
  }

  if (isValidString(mediaObject[InboxConstants.URL])) {
    url = mediaObject[InboxConstants.URL];
  }
  if (mediaType != undefined && url != undefined)
    return new MoEMedia(mediaType, url)
  else return undefined;
}

function actionModelFromJson(actionObject: { [k: string]: any }) {
  var actionType = actionObject[InboxConstants.ACTION_TYPE];
  var navigationType;
  var value;
  var kvPair;
  if (isValidString(actionObject[InboxConstants.NAVIGATION_TYPE])) {
    navigationType = actionObject[InboxConstants.NAVIGATION_TYPE];
  }
  if (isValidString(actionObject[InboxConstants.VALUE])) {
    value = actionObject[InboxConstants.VALUE];
  }
  if (isValidObject(actionObject[InboxConstants.KV_PAIR])) {
    kvPair = actionObject[InboxConstants.KV_PAIR];
  }
  if (actionType != undefined)
    return new MoEAction(actionType, navigationType, value, kvPair)
  else return undefined;
}

function textContentFromJson(textContentObject: { [k: string]: any }) {
  var title;
  var message;
  var summary;
  var subtitle;
  if (isValidString(textContentObject[InboxConstants.TITLE])) {
    title = textContentObject[InboxConstants.TITLE];
  }

  if (isValidString(textContentObject[InboxConstants.MESSAGE])) {
    message = textContentObject[InboxConstants.MESSAGE];
  }

  if (isValidString(textContentObject[InboxConstants.SUMMARY])) {
    summary = textContentObject[InboxConstants.SUMMARY];
  }

  if (isValidString(textContentObject[InboxConstants.SUBTITLE])) {
    subtitle = textContentObject[InboxConstants.SUBTITLE];
  }

  if (title != undefined && message != undefined)
    return new MoETextContent(title, message, summary, subtitle)
  else return undefined;
}

export function unClickedCountFromPayload(payload: string) {
  const json = JSON.parse(payload);
  if (isValidObject(json)) {
    const data = json[MOE_DATA];
    return data[UNCLICKED_COUNT];
  }
  return 0
}

export function inboxMessageToJson(message: MoEInboxMessage) {
  var json: { [k: string]: any } = {
    id: message.id,
    campaignId: message.campaignId,
    isClicked: message.isClicked,
    tag: message.tag,
    receivedTime: message.receivedTime,
    expiry: message.expiry
  };
  if (isValidObject(message.text)) {
    json[InboxConstants.TEXT] = textContentToJson(message.text);
  }

  if (isValidObject(message.media) && message.media != undefined) {
    json[InboxConstants.MEDIA] = mediaToJson(message.media);
  }

  if (isValidObject(message.payload)) {
    json[InboxConstants.PAYLOAD] = message.payload
  }

  if (isValidObject(message.action) && message.action != undefined) {
    var inboxActions = Array<Object>();
    for (var inboxAction of message.action) {
      inboxActions.push(actionToJson(inboxAction));
    }
    json[InboxConstants.ACTION] = inboxActions;
  }

  return json;
}

function textContentToJson(textContent: MoETextContent) {
  var json = {
    title: textContent.title,
    message: textContent.message,
    summary: textContent.summary,
    subtitle: textContent.subtitle,
  };

  return json;
}

function mediaToJson(media: MoEMedia) {
  var json = {
    type: media.mediaType,
    url: media.url
  }
  return json
}

function actionToJson(action: MoEAction) {
  var json = {
    actionType: action.actionType,
    navigationType: action.navigationType,
    value: action.value,
    kvPair: action.kvPair
  }
  return json;
}

export function fetchEmptyInboxModel() {
  var platform;

  if (Platform.OS == "ios")
    platform = MoEPlatform.IOS
  else
    platform = MoEPlatform.Android

  return new MoEInboxData(platform, [])
}
