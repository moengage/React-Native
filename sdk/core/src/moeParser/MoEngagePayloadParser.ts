import MoEAccountMeta from "../models/MoEAccountMeta";
import MoEAuthenticationErrorData from "../models/MoEAuthenticationErrorData";
import MoEJwtErrorCode from "../models/MoEJwtErrorCode";
import MoEngagePersimissionResultData from "../models/MoEngagePersimissionResultData";
import UserDeletionData from "../models/UserDeletionData";
import {
    ACCOUNT_META,
    APP_ID,
    IS_USER_DELETION_SUCCESS,
    MOE_AUTHENTICATION_CODE,
    MOE_AUTHENTICATION_MESSAGE,
    MOE_AUTHENTICATION_TOKEN,
    MOE_AUTHENTICATION_TYPE,
    MOE_AUTHENTICATION_USER_IDENTIFIER,
    MOE_DATA,
    MOE_PAYLOAD,
    MOE_PERMISSION_STATE,
    MOE_PERMISSION_TYPE,
    MOE_PLATFORM
} from "../utils/MoEConstants";

export function getPermissionResult(payload: { [k: string]: any }) {
    return new MoEngagePersimissionResultData(
        payload[MOE_PLATFORM],
        payload[MOE_PERMISSION_STATE],
        payload[MOE_PERMISSION_TYPE]
    )
}

/**
 * Create an instance of {@link MoEAccountMeta} from json object
 * 
 * @param payload - JSON Object with required key
 * @returns instance of {@link MoEAccountMeta}
 * @since 8.6.0
 */
export function getMoEAccountMeta(payload: { [k: string]: any }): MoEAccountMeta {
    return new MoEAccountMeta(payload[APP_ID]);
}

/**
 * Create an instance of {@link UserDeletionData} from json object
 * 
 * @param payload - stringified JSON Object with required key
 * @returns instance of {@link UserDeletionData}
 * @since 8.6.0
 */
export function getUserDeletionData(payload: string): UserDeletionData {
    const payloadJsonObject = JSON.parse(payload);
    return new UserDeletionData(
        getMoEAccountMeta(payloadJsonObject[ACCOUNT_META]),
        payloadJsonObject[MOE_DATA][IS_USER_DELETION_SUCCESS]
    );
}

export function getUserIdentitiesData(payload: string | null): { [k: string]: string } | null {
    if (payload === null) {
        return null;
    }
    const payloadJsonObject: { [k: string]: string } = JSON.parse(payload);
    const mappedIdentities: { [k: string]: string } = {};
    for (let [key, value] of Object.entries(payloadJsonObject)) {
        mappedIdentities[key] = value;
    }
    return mappedIdentities;
}

/**
 * Parse the native authentication error event payload into a typed model.
 *
 * @param notification - raw event data object from the native event emitter
 * @returns instance of {@link MoEAuthenticationErrorData} or null on parse failure
 */
export function getAuthenticationErrorData(notification: { [k: string]: any }): MoEAuthenticationErrorData | null {
    try {
        const payloadJson = JSON.parse(notification[MOE_PAYLOAD]);
        const accountMeta = getMoEAccountMeta(payloadJson[ACCOUNT_META]);
        const platform: string = payloadJson[MOE_PLATFORM] ?? "";
        const data: { [k: string]: any } = payloadJson[MOE_DATA] ?? {};
        const authenticationType: string = data[MOE_AUTHENTICATION_TYPE] ?? "";
        const code: MoEJwtErrorCode = data[MOE_AUTHENTICATION_CODE] as MoEJwtErrorCode ?? MoEJwtErrorCode.Unknown;
        const token: string = data[MOE_AUTHENTICATION_TOKEN] ?? "";
        const userIdentifier: string = data[MOE_AUTHENTICATION_USER_IDENTIFIER] ?? "";
        const message: string = data[MOE_AUTHENTICATION_MESSAGE] ?? "";
        return new MoEAuthenticationErrorData(accountMeta, platform, authenticationType, code, token, userIdentifier, message);
    } catch (e) {
        return null;
    }
}