import { userIdentityStringObjectType, logoutCompleteIosPayload, logoutCompleteAndroidPayload, logoutCompleteInvalidPayload, appId, authenticationErrorIosPayload, authenticationErrorAndroidPayload, authenticationErrorInvalidPayload } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData, getLogoutCompleteData, getAuthenticationErrorData } from "../../moeParser/MoEngagePayloadParser";
import MoELogoutCompleteData from "../../models/MoELogoutCompleteData";
import MoEAuthenticationErrorData from "../../models/MoEAuthenticationErrorData";
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
            expect(result?.data.code).toEqual(MoEJwtErrorCode.TokenNotAvailable);
            expect(result?.data.token).toEqual("dummy-token");
            expect(result?.data.userIdentifier).toEqual("dummy-user");
            expect(result?.data.message).toEqual("token not available");
        });

        it('Android payload should return MoEAuthenticationErrorData with android platform and JWT error details', () => {
            const result = getAuthenticationErrorData(JSON.parse(authenticationErrorAndroidPayload));
            expect(result).toBeInstanceOf(MoEAuthenticationErrorData);
            expect(result?.platform).toEqual(MoEPlatform.Android);
            expect(result?.accountMeta.appId).toEqual(appId);
            expect(result?.data.code).toEqual(MoEJwtErrorCode.InvalidSignature);
        });

        it('invalid payload missing accountMeta should return null', () => {
            const result = getAuthenticationErrorData(JSON.parse(authenticationErrorInvalidPayload));
            expect(result).toBeNull();
        });
    });
});
