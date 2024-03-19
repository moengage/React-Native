import MoEInboxMessage from "../model/MoEInboxMessage";
import { inboxMessageToJson } from "./MoEInboxParser";

export function getMoEInboxMessageJson(moEInboxMessage: MoEInboxMessage, appId: String) {
    var json: { [k: string]: any } = {
        accountMeta: {
            appId: appId
        },
        data: inboxMessageToJson(moEInboxMessage)
    }
    return json;
}

export function getAppIdJson(appId: String) {
    var json: { [k: string]: any } = {
        accountMeta: {
            appId: appId
        }
    }
    return json;
}