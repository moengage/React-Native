import { userIdentityStringObjectType, logoutCompleteIosPayload, logoutCompleteAndroidPayload, logoutCompleteInvalidPayload, appId, authenticationErrorIosPayload, authenticationErrorAndroidPayload, authenticationErrorInvalidPayload, unsetUserAttributeSuccessPayload, unsetUserAttributeFailurePayload, unsetUserAttributeUnknownReasonPayload } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData, getLogoutCompleteData, getAuthenticationErrorData, getUnsetUserAttributeResult } from "../../moeParser/MoEngagePayloadParser";
import MoEUnsetUserAttributeResult from "../../models/MoEUnsetUserAttributeResult";
import { MoERequestFailureReason } from "../../models/MoERequestFailureReason";
import { MoEUserAttributeLevel } from "../../models/MoEUserAttributeLevel";
import MoELogoutCompleteData from "../../models/MoELogoutCompleteData";
import MoEAuthenticationErrorData from "../../models/MoEAuthenticationErrorData";
import MoEJwtAuthenticationErrorData from "../../models/MoEJwtAuthenticationErrorData";
import { MoEPlatform } from "../../models/MoEPlatform";
import { MoEAuthenticationType } from "../../models/MoEAuthenticationType";
import { MoEJwtErrorCode } from "../../models/MoEJwtErrorCode";

describe('MoEngagePayloadParser', () => {

    describe('getUserIdentitiesData', () => {
        it('payload data as null, function should return null', () => {
            expect(getUserIdentitiesData(null)).toEqual(null);
        });

        it('payload data as non-null, function should return the identities', () => {
            expect(getUserIdentitiesData(JSON.stringify(userIdentityStringObjectType))).toEqual(userIdentityStringObjectType);
        });
    });

    describe('getLogoutCompleteData', () => {
        it('iOS payload should return MoELogoutCompleteData with iOS platform and correct appId', () => {
            const result = getLogoutCompleteData(JSON.parse(logoutCompleteIosPayload));
            expect(result).toBeInstanceOf(MoELogoutCompleteData);
            expect(result?.platform).toEqual(MoEPlatform.IOS);
            expect(result?.accountMeta.appId).toEqual(appId);
        });

        it('Android payload should return MoELogoutCompleteData with android platform and correct appId', () => {
            const result = getLogoutCompleteData(JSON.parse(logoutCompleteAndroidPayload));
            expect(result).toBeInstanceOf(MoELogoutCompleteData);
            expect(result?.platform).toEqual(MoEPlatform.Android);
            expect(result?.accountMeta.appId).toEqual(appId);
        });

        it('invalid payload missing accountMeta should return null', () => {
            const result = getLogoutCompleteData(JSON.parse(logoutCompleteInvalidPayload));
            expect(result).toBeNull();
        });
    });

    describe('getAuthenticationErrorData', () => {
        it('iOS payload should return MoEAuthenticationErrorData with iOS platform and JWT error details', () => {
            const result = getAuthenticationErrorData(JSON.parse(authenticationErrorIosPayload));
            expect(result).toBeInstanceOf(MoEAuthenticationErrorData);
            expect(result?.platform).toEqual(MoEPlatform.IOS);
            expect(result?.accountMeta.appId).toEqual(appId);
            expect(result?.authenticationType).toEqual(MoEAuthenticationType.JWT);
            const data = result?.data as MoEJwtAuthenticationErrorData;
            expect(data.code).toEqual(MoEJwtErrorCode.TokenNotAvailable);
            expect(data.token).toEqual("dummy-token");
            expect(data.userIdentifier).toEqual("dummy-user");
            expect(data.message).toEqual("token not available");
        });

        it('Android payload should return MoEAuthenticationErrorData with android platform and JWT error details', () => {
            const result = getAuthenticationErrorData(JSON.parse(authenticationErrorAndroidPayload));
            expect(result).toBeInstanceOf(MoEAuthenticationErrorData);
            expect(result?.platform).toEqual(MoEPlatform.Android);
            expect(result?.accountMeta.appId).toEqual(appId);
            expect((result?.data as MoEJwtAuthenticationErrorData).code).toEqual(MoEJwtErrorCode.InvalidSignature);
        });

        it('invalid payload missing accountMeta should return null', () => {
            const result = getAuthenticationErrorData(JSON.parse(authenticationErrorInvalidPayload));
            expect(result).toBeNull();
        });
    });

    describe('getUnsetUserAttributeResult', () => {
        it('success payload should return a result without failure', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeSuccessPayload);
            expect(result).toBeInstanceOf(MoEUnsetUserAttributeResult);
            expect(result.accountMeta.appId).toEqual(appId);
            expect(result.isUnsetSuccess).toBe(true);
            expect(result.attributeName).toEqual("trial_status");
            expect(result.attributeLevel).toEqual(MoEUserAttributeLevel.Project);
            expect(result.failure).toBeNull();
        });

        it('failure payload should return the failure reason and message', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeFailurePayload);
            expect(result.isUnsetSuccess).toBe(false);
            expect(result.attributeName).toEqual("loyalty_tier");
            expect(result.attributeLevel).toEqual(MoEUserAttributeLevel.Portfolio);
            expect(result.failure?.reason).toEqual(MoERequestFailureReason.InvalidInitialisationConfiguration);
            expect(result.failure?.message).toEqual("Portfolio level requires a configured project id.");
        });

        it('unknown failure reason should fall back to UnknownError', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeUnknownReasonPayload);
            expect(result.failure?.reason).toEqual(MoERequestFailureReason.UnknownError);
        });
    });
});
