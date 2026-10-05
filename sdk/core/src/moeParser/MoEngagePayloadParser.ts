import MoEAccountMeta from "../models/MoEAccountMeta";
import MoELogoutCompleteData from "../models/MoELogoutCompleteData";
import MoEngagePersimissionResultData from "../models/MoEngagePersimissionResultData";
import UserDeletionData from "../models/UserDeletionData";
import MoEAuthenticationErrorData from "../models/MoEAuthenticationErrorData";
import MoEJwtAuthenticationErrorData from "../models/MoEJwtAuthenticationErrorData";
import MoEUnsetUserAttributeResult from "../models/MoEUnsetUserAttributeResult";
import MoERequestFailure from "../models/MoERequestFailure";
import { MoERequestFailureReason } from "../models/MoERequestFailureReason";
import { MoEUserAttributeLevel } from "../models/MoEUserAttributeLevel";
import {
    ACCOUNT_META,
    APP_ID,
    ATTRIBUTE_LEVEL,
    ATTRIBUTE_NAME,
    AUTHENTICATION_TYPE,
    AUTH_ERROR_CODE,
    AUTH_ERROR_MESSAGE,
    FAILURE_MESSAGE,
    FAILURE_REASON,
    IS_UNSET_SUCCESS,
    IS_USER_DELETION_SUCCESS,
    REQUEST_FAILURE,
    MOE_DATA,
    MOE_PERMISSION_STATE,
    MOE_PERMISSION_TYPE,
    MOE_PLATFORM,
    MOE_TOKEN,
    USER_IDENTIFIER
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

/**
 * Create an instance of {@link MoELogoutCompleteData} from json object
 *
 * @param payload - JSON Object with required keys
 * @returns instance of {@link MoELogoutCompleteData} or null if parsing fails
 * @since 12.7.0
 */
export function getLogoutCompleteData(payload: { [k: string]: any }): MoELogoutCompleteData | null {
    try {
        return new MoELogoutCompleteData(
            getMoEAccountMeta(payload[ACCOUNT_META]),
            payload[MOE_PLATFORM]
        );
    } catch (e) {
        return null;
    }
}

/**
 * Create an instance of {@link MoEAuthenticationErrorData} from json object
 *
 * @param payload - JSON Object with required keys
 * @returns instance of {@link MoEAuthenticationErrorData} or null if parsing fails
 * @since 12.10.0
 */
export function getAuthenticationErrorData(payload: { [k: string]: any }): MoEAuthenticationErrorData | null {
    try {
        const data = payload[MOE_DATA];
        return new MoEAuthenticationErrorData(
            getMoEAccountMeta(payload[ACCOUNT_META]),
            payload[MOE_PLATFORM],
            data[AUTHENTICATION_TYPE],
            new MoEJwtAuthenticationErrorData(
                data[AUTH_ERROR_CODE],
                data[MOE_TOKEN],
                data[USER_IDENTIFIER],
                data[AUTH_ERROR_MESSAGE]
            )
        );
    } catch (e) {
        return null;
    }
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
 * Create an instance of {@link MoEUnsetUserAttributeResult} from the stringified native reply
 *
 * @param payload - stringified JSON Object with required keys
 * @returns instance of {@link MoEUnsetUserAttributeResult} if the unset succeeded, else {@link MoERequestFailure}
 */
export function getUnsetUserAttributeResult(payload: string): MoEUnsetUserAttributeResult | MoERequestFailure {
    const payloadJsonObject = JSON.parse(payload);
    const data = payloadJsonObject[MOE_DATA];
    if (data[IS_UNSET_SUCCESS] !== true) {
        const failure = data[REQUEST_FAILURE];
        return new MoERequestFailure(getRequestFailureReason(failure?.[FAILURE_REASON]), failure?.[FAILURE_MESSAGE] ?? "");
    }
    return new MoEUnsetUserAttributeResult(
        getMoEAccountMeta(payloadJsonObject[ACCOUNT_META]),
        data[ATTRIBUTE_NAME],
        data[ATTRIBUTE_LEVEL] === MoEUserAttributeLevel.Portfolio ? MoEUserAttributeLevel.Portfolio : MoEUserAttributeLevel.Project
    );
}

/**
 * Create an instance of {@link MoERequestFailure} from a native promise rejection, which carries
 * the failure reason as the code and the failure message as the message
 *
 * @param error - error with which the native promise was rejected
 * @returns instance of {@link MoERequestFailure}
 */
export function getRequestFailureFromError(error: any): MoERequestFailure {
    return new MoERequestFailure(getRequestFailureReason(error?.code), error?.message ?? `${error}`);
}

// Unknown reasons fall back to UnknownError, so a reason added later does not break parsing
function getRequestFailureReason(value: unknown): MoERequestFailureReason {
    return Object.values(MoERequestFailureReason).includes(value as MoERequestFailureReason)
        ? value as MoERequestFailureReason
        : MoERequestFailureReason.UnknownError;
}
