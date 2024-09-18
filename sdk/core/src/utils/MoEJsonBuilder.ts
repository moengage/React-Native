import MoEClickData from "../models/MoEClickData";
import MoEInAppData from "../models/MoEInAppData";
import MoEProperties from "../models/MoEProperties";
import MoESelfHandledCampaignData from "../models/MoESelfHandledCampaignData";
import { MOE_LOCATION } from "./MoEConstants";
import { MoEPropertiesToJson } from "./MoEObjectToJson";
import { MoEngagePermissionType } from "../models/MoEngagePermissionType";
import MoEInitConfig from "../models/MoEInitConfig";
import MoEngageLogger from "../logger/MoEngageLogger";
import { MoEngageNudgePosition } from "../models/MoEngageNudgePosition";
import { MoESupportedAttributes } from "../models/MoESupportedAttributes";
import MoESelfHandledCampaign from "../models/MoESelfHandledCampaign";
import MoEInAppRules from "../models/MoEInAppRules";

export function getInAppCampaignJson(moEInAppData: MoEInAppData, type: string, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      type: type,
      campaignName: moEInAppData.campaignData.campaignName,
      campaignId: moEInAppData.campaignData.campaignId,
      campaignContext: moEInAppData.campaignData.context,
      platform: moEInAppData.platform
    }
  }
  return JSON.stringify(json);
}

export function getSelfHandledJson(moESelfHandledCampaignData: MoESelfHandledCampaignData, type: string, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      type: type,
      campaignName: moESelfHandledCampaignData.campaignData.campaignName,
      campaignId: moESelfHandledCampaignData.campaignData.campaignId,
      campaignContext: moESelfHandledCampaignData.campaignData.context.attributes,
      selfHandled: getSelfHandledCampaignJson(moESelfHandledCampaignData.campaign),
      platform: moESelfHandledCampaignData.platform
    }
  }
  MoEngageLogger.verbose("getSelfHandledJson(): payload json: ", json);
  return JSON.stringify(json);
}

export function getInAppClickDataJson(moEClickData: MoEClickData, type: string, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      type: type,
      campaignName: moEClickData.campaignData.campaignName,
      campaignId: moEClickData.campaignData.campaignId,
      campaignContext: moEClickData.campaignData.context,
      platform: moEClickData.platform
    }
  }
  return JSON.stringify(json);
}

export function getMoEPropertiesJson(moEProperties: MoEProperties, eventName: String, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      ...MoEPropertiesToJson(moEProperties),
      eventName,
    }
  }
  return JSON.stringify(json);
}

export function getMoEPushCampaignJson(pushPayload: object, service: string, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      payload: pushPayload,
      service: service
    }
  }
  return JSON.stringify(json);
}

export function getMoEPushTokenJson(pushToken: string, pushService: string, platform: string, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      token: pushToken,
      service: pushService,
      platform: platform

    }
  }
  return JSON.stringify(json);
}

export function getAliasJson(alias: String, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data:
      { alias: alias }
  }
  return JSON.stringify(json);
}
export function getAppStatusJson(appStatus: String, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      appStatus: appStatus
    }
  }
  return JSON.stringify(json);
}

export function getUserAttributeJson(name: String, value: MoESupportedAttributes, type: String, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      attributeName: name,
      attributeValue: value,
      type: type,
    }
  }
  return JSON.stringify(json);
}

export function getUserLocAttributeJson(name: String, latitude: Number, longitude: Number, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      attributeName: name,
      type: MOE_LOCATION,
      locationAttribute: {
        latitude: latitude,
        longitude: longitude,
      }
    }
  }
  return JSON.stringify(json);
}

export function getInAppContextJson(contexts: Array<String>, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      contexts: contexts
    }
  }
  return JSON.stringify(json);
}

export function getSdkStateJson(isSdkEnabled: Boolean, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      isSdkEnabled: isSdkEnabled,

    }
  }
  return JSON.stringify(json);
}

export function getAdIdTrackingJson(isAdIdTrackingEnabled: Boolean, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      isAdIdTrackingEnabled: isAdIdTrackingEnabled,
    }
  }
  return JSON.stringify(json);
}

export function getAndroidIdTrackingJson(isAndroidIdTrackingEnabled: Boolean, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      isAndroidIdTrackingEnabled: isAndroidIdTrackingEnabled
    }
  }
  return JSON.stringify(json);
}

export function getAppIdJson(appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    }
  }
  return JSON.stringify(json);
}

export function getOptOutTrackingJson(type: string, state: boolean, appId: string) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      type: type,
      state: state
    }
  }
  return JSON.stringify(json);
}

export function getPermissionResponseJson(isGranted: boolean, permissionType: MoEngagePermissionType) {
  let json: { [k: string]: any } = {
    isGranted: isGranted,
    type: permissionType.toLowerCase()
  }
  return JSON.stringify(json);
}

export function getPushPermissionRequestCountJson(count: number, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      pushOptinInAttemptCount: count
    }
  }
  return JSON.stringify(json);
}

export function getDeviceIdTrackingJson(isDeviceIdTrackingEnabled: Boolean, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      isDeviceIdTrackingEnabled: isDeviceIdTrackingEnabled
    }
  }
  return JSON.stringify(json);
}

export function getInitConfigJson(appId: String, initConfig: MoEInitConfig) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    initConfig: {
      pushConfig: {
        shouldDeliverCallbackOnForegroundClick: initConfig.pushConfig.shouldDeliverCallbackOnForegroundClick
      },
      analyticsConfig: {
        shouldTrackUserAttributeBooleanAsNumber: initConfig.analyticsConfig.shouldTrackUserAttributeBoolAsNumber
      }
    }
  }
  return JSON.stringify(json);
}

export function getNudgeDisplayJson(nudgePosition: MoEngageNudgePosition, appId: String) {
  var json: { [k: string]: any } = {
    accountMeta: {
      appId: appId
    },
    data: {
      position: nudgePosition.toString()
    }
  }
  return JSON.stringify(json);
}

export function getSelfHandledCampaignJson(moESelfHandledCampaign: MoESelfHandledCampaign) {
  var json: { [k: string]: any } = {
    dismissInterval: moESelfHandledCampaign.dismissInterval,
    displayRules: moESelfHandledCampaign.displayRules,
    payload: moESelfHandledCampaign.payload
  }
  MoEngageLogger.verbose("getSelfHandledCampaignJson(): payload json: ", json);
  return json;
}

export function getDisplayRulesJson(displayRules: MoEInAppRules) {
  var json: { [k: string]: any } = {
    contexts: displayRules.contexts,
    screenName: displayRules.screenName
  }
  MoEngageLogger.verbose("getDisplayRulesJson(): payload json: ", json);
  return json;
}