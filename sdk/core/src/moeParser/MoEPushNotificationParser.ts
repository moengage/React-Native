import MoEngageLogger from "../logger/MoEngageLogger";
import MoEAccountMeta from "../models/MoEAccountMeta";
import MoEPushCampaign from "../models/MoEPushCampaign";
import MoEPushPayload from "../models/MoEPushPayload";
import MoEPushToken from "../models/MoEPushToken";
import { APP_ID, MOE_CLICKED_ACTION, MOE_IS_DEFAULT_ACTION, MOE_PAYLOAD, MOE_PLATFORM, MOE_PUSH_CAMPAIGN_OBJ_ERROR, MOE_PUSH_SERVICE, MOE_PUSH_TOKEN_OBJ_ERROR, MOE_TOKEN, SELF_HANDLED_PUSH_REDIRECTION_KEY } from "../utils/MoEConstants";


/**
 * 
 * @param obj is a json  that has MoEPushToken details
 * @returns true if obj is a valid MoEPushToken Object else false
 */
export function isPushTokenValid(tokenPayload: { [k: string]: any }) {
    try {
        if (tokenPayload != undefined && tokenPayload[MOE_PLATFORM] != undefined && tokenPayload[MOE_PUSH_SERVICE] != undefined && tokenPayload[MOE_TOKEN] != undefined)
            return true;
        else {
            throw new Error(MOE_PUSH_TOKEN_OBJ_ERROR);
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }

}

/**
 * this funtion creates MoEPushToken Object from json
 */
export function getMoEPushToken(tokenPayload: { [k: string]: any }) {
    if (isPushTokenValid(tokenPayload)) {
        var platform = tokenPayload[MOE_PLATFORM];
        var pushService = tokenPayload[MOE_PUSH_SERVICE];
        var token = tokenPayload[MOE_TOKEN];
        return new MoEPushToken(platform, pushService, token)
    }
    else return undefined

}


/**
 * 
 * @param obj is a json  that has MoEPushCampaign details
 * @returns true if obj is a valid MoEPushCampaign Object else false
 */
export function isPushCampaignObjectValid(pushPayload: { [k: string]: any }) {
    try {
        if (pushPayload[MOE_PLATFORM] != undefined && pushPayload[MOE_PAYLOAD] != undefined)
            return true;
        else {
            throw new Error(MOE_PUSH_CAMPAIGN_OBJ_ERROR);
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }

}

/**
 * this funtion creates MoEPushCampaign Object from json
 */
export function getMoEPushPayload(pushPayload: { [k: string]: any },accountMetaPayload:{ [k: string]: any }) {
    if (isPushCampaignObjectValid(pushPayload)) {
        var payload = pushPayload[MOE_PAYLOAD];
        var isDefaultAction = pushPayload[MOE_IS_DEFAULT_ACTION];
        var clickAction = pushPayload[MOE_CLICKED_ACTION];
        var selfHandledPushRedirection = SELF_HANDLED_PUSH_REDIRECTION_KEY in pushPayload
                ? pushPayload[SELF_HANDLED_PUSH_REDIRECTION_KEY]
                : false;
        var pushCampaignPayload = new MoEPushCampaign(payload, isDefaultAction, clickAction, selfHandledPushRedirection);
        var accountMeta = new MoEAccountMeta(accountMetaPayload[APP_ID])
        var platform = pushPayload[MOE_PLATFORM];
        return new MoEPushPayload(accountMeta, pushCampaignPayload,platform);
    }
    else return undefined

}