import MoEGeoLocation from "../models/MoEGeoLocation";
import MoEInAppCustomAction from "../models/MoEInAppCustomAction";
import MoEProperties from "../models/MoEProperties";
import MoEPushCampaign from "../models/MoEPushCampaign";
import MoEPushToken from "../models/MoEPushToken";

export function MoEGeoLocationToJson(location: MoEGeoLocation) {
    return {
        latitude: location.latitude,
        longitude: location.longitude,
    };
}
export function MoEInAppCustomActionToJson(moEInAppCustomAction: MoEInAppCustomAction | undefined) {
    return {
        kvPair: moEInAppCustomAction?.keyValuePair,
    };
}

export function MoEPropertiesToJson(moEProperties: MoEProperties) {
    return {
        eventAttributes: {
            generalAttributes: moEProperties.getGeneralAttributes(),
            locationAttributes: moEProperties.getLocationAttributess(),
            dateTimeAttributes: moEProperties.getDateTimeAttributes(),
        },
        isNonInteractive: moEProperties.getIsNonInteractive(),
    };
}

export function MoEPushCampaignToJson(moEPushCampaign: MoEPushCampaign) {
    return {
        payload: moEPushCampaign.payload,
        isDefaultAction: moEPushCampaign.isDefaultAction,
        clickAction: moEPushCampaign.clickAction,

    };
}
export function MoEPushTokenToJson(MoEPushToken: MoEPushToken) {
    return {
        platform: MoEPushToken.platform,
        service: MoEPushToken.pushService,
        token: MoEPushToken.token,
    };
}