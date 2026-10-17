import { userIdentityStringObjectType, logoutCompleteIosPayload, logoutCompleteAndroidPayload, logoutCompleteInvalidPayload, appId, authenticationErrorIosPayload, authenticationErrorAndroidPayload, authenticationErrorInvalidPayload, unsetUserAttributeSuccessPayload, unsetUserAttributeFailurePayload, unsetUserAttributeUnknownReasonPayload } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData, getLogoutCompleteData, getAuthenticationErrorData, getUnsetUserAttributeResult, getRequestFailureFromError } from "../../moeParser/MoEngagePayloadParser";
import MoEUnsetUserAttributeResult from "../../models/MoEUnsetUserAttributeResult";
import MoERequestFailure from "../../models/MoERequestFailure";
import { MoEngageFailureReason } from "../../models/MoEngageFailureReason";
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
        it('success payload should return the unset result', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeSuccessPayload) as MoEUnsetUserAttributeResult;
            expect(result).toBeInstanceOf(MoEUnsetUserAttributeResult);
            expect(result.attributeName).toEqual("trial_status");
            expect(result.attributeLevel).toEqual(MoEUserAttributeLevel.PROJECT);
        });

        it('failure payload should return a failure with reason and message', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeFailurePayload) as MoERequestFailure;
            expect(result).toBeInstanceOf(MoERequestFailure);
            expect(result.reason).toEqual(MoEngageFailureReason.INVALID_INITIALISATION_CONFIGURATION);
            expect(result.message).toEqual("Portfolio level requires a configured project id.");
        });

        it('unknown failure reason should fall back to UNKNOWN_ERROR', () => {
            const result = getUnsetUserAttributeResult(unsetUserAttributeUnknownReasonPayload) as MoERequestFailure;
            expect(result).toBeInstanceOf(MoERequestFailure);
            expect(result.reason).toEqual(MoEngageFailureReason.UNKNOWN_ERROR);
        });
    });

    describe('getRequestFailureFromError', () => {
        it('native rejection should map code to reason and keep the message', () => {
            const error = Object.assign(new Error("Attribute name is empty"), { code: "INVALID_PARAMETERS" });
            const result = getRequestFailureFromError(error);
            expect(result).toBeInstanceOf(MoERequestFailure);
            expect(result.reason).toEqual(MoEngageFailureReason.INVALID_PARAMETERS);
            expect(result.message).toEqual("Attribute name is empty");
        });

        it.each(Object.values(MoEngageFailureReason))('native code %s should map to the matching reason', (code) => {
            expect(getRequestFailureFromError(Object.assign(new Error("x"), { code })).reason).toEqual(code);
        });

        it('unknown or missing code should fall back to UNKNOWN_ERROR', () => {
            expect(getRequestFailureFromError(Object.assign(new Error("x"), { code: "Error" })).reason).toEqual(MoEngageFailureReason.UNKNOWN_ERROR);
            expect(getRequestFailureFromError(new Error("x")).reason).toEqual(MoEngageFailureReason.UNKNOWN_ERROR);
        });
    });
});
