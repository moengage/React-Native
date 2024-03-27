import MoEInboxMessage from "../model/MoEInboxMessage";
import { inboxMessageToJson } from "./MoEInboxParser";

export function getMoEInboxMessageJson(moEInboxMessage: MoEInboxMessage, appId: String) {
    let payload = {
        accountMeta: {
            appId: appId
        },
        data: inboxMessageToJson(moEInboxMessage)
    }
    
    return JSON.stringify(payload);
}

export function getAppIdJson(appId: String) {
    let payload = {
        accountMeta: {
            appId: appId
        }
    }

    return JSON.stringify(payload);
}