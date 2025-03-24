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