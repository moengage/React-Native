import MoEAccountMeta from "../models/MoEAccountMeta";
import MoEngagePersimissionResultData from "../models/MoEngagePersimissionResultData";
import UserDeletionData from "../models/UserDeletionData";
import {
    ACCOUNT_META,
    APP_ID,
    IS_USER_DELETION_SUCCESS,
    MOE_DATA,
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