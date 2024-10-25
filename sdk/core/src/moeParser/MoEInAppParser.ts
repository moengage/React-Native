import MoEngageLogger from "../logger/MoEngageLogger";
import MoECampaignContext from "../models/MoECampaignContext";
import MoECampaignData from "../models/MoECampaignData";
import MoEClickData from "../models/MoEClickData";
import MoEInAppCustomAction from "../models/MoEInAppCustomAction";
import MoEInAppData from "../models/MoEInAppData";
import MoEInAppNavigation from "../models/MoEInAppNavigation";
import MoEInAppRules from "../models/MoEInAppRules";
import MoESelfHandledCampaign from "../models/MoESelfHandledCampaign";
import MoESelfHandledCampaignData from "../models/MoESelfHandledCampaignData";
import MoESelfHandledCampaignsData from "../models/MoESelfHandledCampaignsData";

import {
    ACTION_TYPE,
    FORMATTED_CAMPAIGN_ID,
    MOE_CAMPAIGN_CONTEXT,
    MOE_CAMPAIGN_ID,
    MOE_CAMPAIGN_NAME,
    MOE_CUSTOM_ACTION,
    MOE_CUSTOM_ACTION_OBJ_ERROR,
    MOE_DISMISSINTERVAL,
    MOE_IN_APP_OBJECT_ERROR,
    MOE_KEY_VALUE_PAIR,
    MOE_NAVIGATION,
    MOE_NAVIGATION_OBJ_ERROR,
    MOE_NAVIGATION_TYPE,
    MOE_PAYLOAD,
    MOE_PLATFORM,
    MOE_SELF_HANDLED,
    MOE_NAVIGATION_VALUE,
    MOE_INAPP_DISPLAY_RULES,
    MOE_INAPP_SCREEN_NAME,
    MOE_INAPP_CONTEXTS,
    MOE_DATA,
    ACCOUNT_META
} from "../utils/MoEConstants";
import { isValidObject } from "../utils/MoEHelper";
import { getMoEAccountMeta } from "./MoEngagePayloadParser";

/**
 * 
 * @param obj is a json that has InApp details
 * @returns true if obj is a valid InApp Object else false
 */
export function isMoEInAppCampaignValid(obj: { [k: string]: any }) {
    try {
        if (obj != undefined && obj[MOE_CAMPAIGN_ID] != undefined && obj[MOE_CAMPAIGN_NAME] != undefined && obj[MOE_CAMPAIGN_CONTEXT]
            && obj[MOE_PLATFORM]) {
            return true;
        }
        else {
            throw new Error(MOE_IN_APP_OBJECT_ERROR);
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }
}

function getMoECampaignData(json: { [k: string]: any }) {
    MoEngageLogger.verbose("getMoECampaignData(): Payload: ", json);
    var campaignId = json[MOE_CAMPAIGN_ID];
    var campaignName = json[MOE_CAMPAIGN_NAME];
    var campaignContext = json[MOE_CAMPAIGN_CONTEXT];
    var formattedCampaignId = campaignContext[FORMATTED_CAMPAIGN_ID];
    var campaignContextObj = new MoECampaignContext(formattedCampaignId, campaignContext);
    return new MoECampaignData(campaignId, campaignName, campaignContextObj);
}

function getMoESelfHandledCampaign(json: { [k: string]: any }) {
    var selfHandled = json[MOE_SELF_HANDLED];
    var payload = selfHandled[MOE_PAYLOAD];
    var dismissInterval = selfHandled[MOE_DISMISSINTERVAL];
    let displayRulesPayload = selfHandled[MOE_INAPP_DISPLAY_RULES];
    let displayRules = getMoEInAppRules(displayRulesPayload);

    return new MoESelfHandledCampaign(payload, dismissInterval, displayRules);
}

function getMoEInAppRules(json: { [k: string]: any }) {
    var screenName: string | null = null;
    if (json[MOE_INAPP_SCREEN_NAME] != undefined) {
        screenName = json[MOE_INAPP_SCREEN_NAME];
    }
    var contexts = json[MOE_INAPP_CONTEXTS];
    return new MoEInAppRules(screenName, contexts);
}

function getMoEInAppCustomAction(json: { [k: string]: any }) {
    var customAction = json[MOE_CUSTOM_ACTION]
    var keyValuePair = customAction[MOE_KEY_VALUE_PAIR]
    var actionType = json[ACTION_TYPE]
    return new MoEInAppCustomAction(keyValuePair, actionType)
}

function getMoEInAppNavigation(json: { [k: string]: any }) {
    var navigation = json[MOE_NAVIGATION]
    var navigationType = navigation[MOE_NAVIGATION_TYPE]
    var url = navigation[MOE_NAVIGATION_VALUE]
    var keyValuePair = navigation[MOE_KEY_VALUE_PAIR]
    var actionType = json[ACTION_TYPE]
    return new MoEInAppNavigation(navigationType, url, keyValuePair, actionType)

}
/**
 * this funtion creates MoEInAppData Object from json
 */
export function getMoEInAppData(json: { [k: string]: any }, accountMetaPayload: { [k: string]: any }) {
    if (isMoEInAppCampaignValid(json)) {
        var campaignData = getMoECampaignData(json);
        var platform = json[MOE_PLATFORM];
        var accountMeta = getMoEAccountMeta(accountMetaPayload);
        return new MoEInAppData(accountMeta, platform, campaignData);
    }
    else return undefined
}

/**
 * this funtion creates MoESelfHandledCampaignData Object from json
 */
export function getMoESelfHandledCampaignData(json: { [k: string]: any }, accountMetaPayload: { [k: string]: any }) {
    MoEngageLogger.verbose("getMoESelfHandledCampaignData(): Payload: ", json);
    if (isSelfHandledCampaignValid(json)) {
        var campaignData = getMoECampaignData(json);
        var platform = json[MOE_PLATFORM];
        var accountMeta = getMoEAccountMeta(accountMetaPayload);
        var campaign = getMoESelfHandledCampaign(json);
        return new MoESelfHandledCampaignData(accountMeta, platform, campaign, campaignData);
    }
    else return null
}


/**
 * This function checks weather customAction key exists or not. And also checks value is a type of object
 */
export function isInAppCustomActionValid(obj: { [k: string]: any }) {
    try {
        if (obj[MOE_CUSTOM_ACTION] != undefined && isValidObject(obj[MOE_CUSTOM_ACTION])) {
            return true;
        }
        else {
            throw new Error(MOE_CUSTOM_ACTION_OBJ_ERROR);
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }
}

/**
 * this funtion creates MoEInAppCustomAction Object from json
 */
export function getCustomActionObj(json: { [k: string]: any }, accountMetaPayload: { [k: string]: any }) {
    if (isInAppCustomActionValid(json)) {
        var campaignData = getMoECampaignData(json);
        var platform = json[MOE_PLATFORM];
        var accountMeta = getMoEAccountMeta(accountMetaPayload);
        var action = getMoEInAppCustomAction(json);

        return new MoEClickData(accountMeta, platform, campaignData, action);
    }
    else return undefined


}


/**
 * This function checks weather selfHandled key exists or not. 
 * checks value is a type of object
 * checks mandatory keys of selfHandled exist or not 
 */
export function isSelfHandledCampaignValid(obj: { [k: string]: any }) {
    try {
        if (obj[MOE_SELF_HANDLED] != undefined && isValidObject(obj[MOE_SELF_HANDLED])) {
            var selfHandled = obj[MOE_SELF_HANDLED];
            if (selfHandled[MOE_PAYLOAD] != undefined && selfHandled[MOE_DISMISSINTERVAL] != undefined) {
                MoEngageLogger.info("SelfHandled campaign has data");
                return true;
            } else {
                MoEngageLogger.info("SelfHandled campaign has no data");
                return false;
            }

        } else {
            return false;
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }
}

/**
 * This function checks weather navigation key exists or not. And also checks value is a type of object
 */
export function isNavigationValid(obj: { [k: string]: any }) {
    try {
        if (obj[MOE_NAVIGATION] != undefined && isValidObject(obj[MOE_NAVIGATION])) {
            return true;
        }
        else {
            throw new Error(MOE_NAVIGATION_OBJ_ERROR);
        }
    }
    catch (error: any) {
        MoEngageLogger.error(error?.message);
        return false;
    }
}

/**
 * this funtion creates MoEInAppNavigation Object from json
 */
export function getNavigationObj(json: { [k: string]: any }, accountMetaPayload: { [k: string]: any }) {
    if (isNavigationValid(json)) {
        var campaignData = getMoECampaignData(json);
        var platform = json[MOE_PLATFORM];
        var accountMeta = getMoEAccountMeta(accountMetaPayload);
        var action = getMoEInAppNavigation(json);
        return new MoEClickData(accountMeta, platform, campaignData, action);
    }
    else return undefined
}

export function getMoESelfHandledCampaignsDataObj(payload: string) {
    const jsonPayload = JSON.parse(payload);
    const accountMeta = getMoEAccountMeta(jsonPayload[ACCOUNT_META]);
    const selfHandledCampaigns: Array<MoESelfHandledCampaignData> = [];

    for (let i = 0; i < jsonPayload.campaigns.length; i++) {
        const campaignJson = jsonPayload.campaigns[i];
        const campaignPayload = campaignJson[MOE_DATA];

        if (isSelfHandledCampaignValid(campaignPayload)) {
            const campaign = getMoESelfHandledCampaign(campaignPayload);
            var platform = campaignPayload[MOE_PLATFORM];
            const campaignData = getMoECampaignData(campaignPayload);
            const campaignInfo = new MoESelfHandledCampaignData(accountMeta, platform, campaign, campaignData);
            selfHandledCampaigns.push(campaignInfo);
        }
    }
    return new MoESelfHandledCampaignsData(accountMeta, selfHandledCampaigns);
}