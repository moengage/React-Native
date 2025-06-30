import MoEAction from "../model/MoEAction";
import { MoEActionType } from "../model/MoEActionType";
import MoEInboxMessage from "../model/MoEInboxMessage";
import MoEMedia from "../model/MoEMedia";
import { MoEMediaType } from "../model/MoEMediaType";
import MoETextContent from "../model/MoETextContent";
import { MoEAccessibilityData } from "react-native-moengage";

/**
 * Mock data for InboxMessage without group key and notification id
 */
export const inboxMessageJson1 = {
    "id": 5,
    "campaignId": "1747738461272",
    "text": {
        "title": "title",
        "message": "message",
        "summary": "summary"
    },
    "action": [
        {
            "actionType": "navigation",
            "navigationType": "richLanding",
            "value": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
            "kvPair": {
                "gcm_activityName": "com.moe.pushlibrary.activities.MoEActivity",
                "moe_app_id": "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG",
                "moe_notification_posted_time": 1747738462849,
                "gcm_subtext": "summary",
                "gcm_notificationType": "normal notification",
                "moeFeatures": "{}",
                "moe_cid_attr": "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}",
                "push_from": "moengage",
                "MOE_MSG_RECEIVED_TIME": 1747738462835,
                "gcm_alert": "message",
                "gcm_title": "title",
                "gcm_webUrl": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
                "gcm_campaign_id": "1747738461272"
            }
        }
    ],
    "isClicked": false,
    "receivedTime": "2025-05-20T10:54:22.835Z",
    "expiry": "2025-08-18T10:54:22.000Z",
    "tag": "general",
    "payload": {
        "gcm_activityName": "com.moe.pushlibrary.activities.MoEActivity",
        "moe_app_id": "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG",
        "moe_notification_posted_time": 1747738462849,
        "gcm_subtext": "summary",
        "gcm_notificationType": "normal notification",
        "moeFeatures": "{}",
        "moe_cid_attr": "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}",
        "push_from": "moengage",
        "MOE_MSG_RECEIVED_TIME": 1747738462835,
        "gcm_alert": "message",
        "gcm_title": "title",
        "gcm_webUrl": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
        "gcm_campaign_id": "1747738461272"
    },
    "sentTime": "2025-05-20T10:54:21.000Z"
}
export const actionMap1 = new Map<String, Object>()
actionMap1.set("gcm_activityName", "com.moe.pushlibrary.activities.MoEActivity")
actionMap1.set("moe_app_id", "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG")
actionMap1.set("moe_notification_posted_time", 1747738462849)
actionMap1.set("gcm_subtext", "summary")
actionMap1.set("gcm_notificationType", "normal notification")
actionMap1.set("moe_cid_attr", "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}")
actionMap1.set("push_from", "moengage")
actionMap1.set("MOE_MSG_RECEIVED_TIME", 1747738462835)
actionMap1.set("gcm_alert", "message")
actionMap1.set("gcm_title", "title")
actionMap1.set("gcm_webUrl", "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog")
actionMap1.set("gcm_campaign_id", "1747738461272")

export const payloadMap1 = new Map<String, Object>()
payloadMap1.set("gcm_activityName", "com.moe.pushlibrary.activities.MoEActivity")
payloadMap1.set("moe_app_id", "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG")
payloadMap1.set("moe_notification_posted_time", 1747738462849)
payloadMap1.set("gcm_subtext", "summary")
payloadMap1.set("gcm_notificationType", "normal notification")
payloadMap1.set("moe_cid_attr", "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}")
payloadMap1.set("push_from", "moengage")
payloadMap1.set("MOE_MSG_RECEIVED_TIME", 1747738462835)
payloadMap1.set("gcm_alert", "message")
payloadMap1.set("gcm_title", "title")
payloadMap1.set("gcm_webUrl", "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog")
payloadMap1.set("gcm_campaign_id", "1747738461272")

export const inboxMessage1 = new MoEInboxMessage(
    5,
    "1747738461272",
    new MoETextContent(
        "title",
        "message",
        "summary",
        undefined
    ),
    false,
    undefined,
    [
        new MoEAction(
            MoEActionType.NAVIGATION,
            "richLanding",
            "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
            actionMap1
        )
    ],
    "general",
    "2025-05-20T10:54:22.835Z",
    "2025-08-18T10:54:22.000Z",
    payloadMap1,
    null,
    null,
    "2025-05-20T10:54:21.000Z"
)

/*
 * Mock data for InboxMessage with group key, notification id and media
 */
export const inboxMessageJson2 = {
    "id": 5,
    "campaignId": "1747738461272",
    "text": {
        "title": "title",
        "message": "message",
        "summary": "summary"
    },
    "action": [
        {
            "actionType": "navigation",
            "navigationType": "richLanding",
            "value": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
            "kvPair": {
                "gcm_activityName": "com.moe.pushlibrary.activities.MoEActivity",
                "moe_app_id": "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG",
                "moe_notification_posted_time": 1747738462849,
                "gcm_subtext": "summary",
                "gcm_notificationType": "normal notification",
                "moe_cid_attr": "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}",
                "push_from": "moengage",
                "MOE_MSG_RECEIVED_TIME": 1747738462835,
                "gcm_alert": "message",
                "gcm_title": "title",
                "gcm_webUrl": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
                "gcm_campaign_id": "1747738461272"
            }
        }
    ],
    "isClicked": false,
    "receivedTime": "2025-05-20T10:54:22.835Z",
    "expiry": "2025-08-18T10:54:22.000Z",
    "tag": "general",
    "media": {
        "type": "image",
        "url": "https://www.moengage.com/wp-content/uploads/forrester-wave-report-24.png",
        "accessibility": {
            "text": "Accessibility label for image",
            "hint": "Accessibility hint for image"
        }
    },
    "payload": {
        "gcm_activityName": "com.moe.pushlibrary.activities.MoEActivity",
        "moe_app_id": "DAO6UGZ73D9RTK8B5W96TPYN_DEBUG",
        "moe_notification_posted_time": 1747738462849,
        "gcm_subtext": "summary",
        "gcm_notificationType": "normal notification",
        "moeFeatures": "{}",
        "moe_cid_attr": "{\"moe_campaign_id\":\"1747738461272\",\"moe_campaign_type\":\"General Push Campaign\",\"moe_delivery_type\":\"One Time\",\"moe_campaign_name\":\"Basic Push\",\"moe_campaign_channel\":\"Push\",\"sent_epoch_time\":1747738461}",
        "push_from": "moengage",
        "MOE_MSG_RECEIVED_TIME": 1747738462835,
        "gcm_alert": "message",
        "gcm_title": "title",
        "gcm_webUrl": "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
        "gcm_campaign_id": "1747738461272"
    },
    "groupKey": "group2",
    "notificationId": "notification123",
    "sentTime": "2025-05-20T10:54:21.000Z"
}

/**
 * Mock data for InboxMessage with group key, notification id and media
 */
export const inboxMessage2 = new MoEInboxMessage(
    5,
    "1747738461272",
    new MoETextContent(
        "title",
        "message",
        "summary",
        undefined
    ),
    false,
    new MoEMedia(MoEMediaType.IMAGE, "https://www.moengage.com/wp-content/uploads/forrester-wave-report-24.png", new MoEAccessibilityData("Accessibility label for image",  "Accessibility hint for image")),
    [
        new MoEAction(
            MoEActionType.NAVIGATION,
            "richLanding",
            "https://developers.moengage.com/hc/en-us/articles/4407395989268-Installing-Version-Catalog",
            actionMap1
        )
    ],
    "general",
    "2025-05-20T10:54:22.835Z",
    "2025-08-18T10:54:22.000Z",
    payloadMap1,
    "group2",
    "notification123",
    "2025-05-20T10:54:21.000Z"
)
