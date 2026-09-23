import { ACCOUNT_META, APP_ID, MOE_DATA, USER_IDENTITY, USER_UNIQUE_IDENTITY } from "../utils/MoEConstants";

export const appId = "DummyAppId"

export const appIdPayload = {
    [APP_ID]: appId
};

export const userIdentityStringType = "identity";

export const userIdentityStringObjectType = {
    "idKey1": "idVal1",
    "idKey2": "idVal2"
};

export const expectedUserIdentityStringTypePayload = {
    [ACCOUNT_META]: appIdPayload,
    [MOE_DATA]: {
        [USER_IDENTITY]: {
            [USER_UNIQUE_IDENTITY]: userIdentityStringType
        }
    }
};

export const expectedUserIdentityStringObjectTypePayload = {
    [ACCOUNT_META]: appIdPayload,
    [MOE_DATA]: {
        [USER_IDENTITY]: userIdentityStringObjectType
    }
};

export const logoutCompleteIosPayload = JSON.stringify({
    platform: "iOS",
    accountMeta: { appId: appId }
});

export const logoutCompleteAndroidPayload = JSON.stringify({
    platform: "android",
    accountMeta: { appId: appId }
});

export const logoutCompleteInvalidPayload = JSON.stringify({
    platform: "iOS"
});

export const authenticationErrorIosPayload = JSON.stringify({
    accountMeta: { appId: appId },
    platform: "iOS",
    data: {
        authenticationType: "JWT",
        code: "TOKEN_NOT_AVAILABLE",
        token: "dummy-token",
        userIdentifier: "dummy-user",
        message: "token not available"
    }
});

export const authenticationErrorAndroidPayload = JSON.stringify({
    accountMeta: { appId: appId },
    platform: "android",
    data: {
        authenticationType: "JWT",
        code: "INVALID_SIGNATURE",
        token: "dummy-token",
        userIdentifier: "dummy-user",
        message: "invalid signature"
    }
});

export const authenticationErrorInvalidPayload = JSON.stringify({
    platform: "iOS",
    data: {
        authenticationType: "JWT",
        code: "UNKNOWN",
        token: "",
        userIdentifier: "",
        message: ""
    }
});

// Shapes below mirror what MoEngagePluginBase (iOS) emits for the in-app custom action and
// push click callbacks.
export const inAppCustomActionKeyValuePair = { key: "test321" };

export const inAppCustomActionIosPayload = JSON.stringify({
    accountMeta: { appId: appId },
    data: {
        platform: "iOS",
        campaignId: "dummyCampaignId",
        campaignName: "dummyCampaignName",
        campaignContext: { cid: "dummyCampaignId_F_T_IA_AB_1_P_0_L_0" },
        actionType: "customAction",
        customAction: { kvPair: inAppCustomActionKeyValuePair }
    }
});

export const pushClickedWithoutActionIosPayload = JSON.stringify({
    accountMeta: { appId: appId },
    data: {
        platform: "iOS",
        payload: { app_extra: { screenData: {} } },
        clickedAction: {}
    }
});
