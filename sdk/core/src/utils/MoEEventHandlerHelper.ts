import {isValidObject} from "../utils/MoEHelper";
import {
    getCustomActionObj,
    getMoEInAppData,
    getNavigationObj,
    getMoESelfHandledCampaignData
} from "../moeParser/MoEInAppParser";
import {getMoEPushPayload, getMoEPushToken} from "../moeParser/MoEPushNotificationParser";
import {MOE_DATA, ACCOUNT_META, MOE_PAYLOAD} from "./MoEConstants";
import {PERMISSION_RESULT} from "..";
import {getPermissionResult} from "../moeParser/MoEngagePayloadParser";

export function executeHandler(
    handler: Function,
    notification: any,
    type: String
) {
    if (handler && type) {
        const payload = notification[MOE_PAYLOAD];
        const notificationPayload = JSON.parse(payload);
        if (isValidObject(notificationPayload)) {
            if (type == "pushTokenGenerated") {
                var pushTokenObject = getMoEPushToken(notificationPayload);
                pushTokenObject != undefined ? handler(pushTokenObject) : null;
            } else if (type == PERMISSION_RESULT) {
                let payload = getPermissionResult(notificationPayload)
                handler(payload)
            } else {
                const accountMeta = notificationPayload[ACCOUNT_META];
                if (accountMeta != undefined && isValidObject(accountMeta)) {
                    const payload = notificationPayload[MOE_DATA];
                    if (type == "inAppCampaignShown" || type == "inAppCampaignDismissed") {
                        var inAppObject = getMoEInAppData(payload, accountMeta);
                        inAppObject != undefined ? handler(inAppObject) : null;
                    } else if (type == "inAppCampaignSelfHandled") {
                        var selfHandled = getMoESelfHandledCampaignData(payload, accountMeta);
                        selfHandled != undefined ? handler(selfHandled) : null;
                    } else if (type == "inAppCampaignCustomAction") {
                        var cutomAction = getCustomActionObj(payload, accountMeta);
                        cutomAction != undefined ? handler(cutomAction) : null;
                    } else if (type == "inAppCampaignClicked") {
                        var navigationAction = getNavigationObj(payload, accountMeta);
                        navigationAction != undefined ? handler(navigationAction) : null;
                    } else if (type == "pushClicked") {
                        var pushCampaignObject = getMoEPushPayload(payload, accountMeta);
                        pushCampaignObject != undefined ? handler(pushCampaignObject) : null;
                    }
                }

            }
        }
    }
}
