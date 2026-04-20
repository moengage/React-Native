import { userIdentityStringObjectType, logoutCompleteIosPayload, logoutCompleteAndroidPayload, appId } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData, getLogoutCompleteData } from "../../moeParser/MoEngagePayloadParser";
import MoELogoutCompleteData from "../../models/MoELogoutCompleteData";
import { MoEPlatform } from "../../models/MoEPlatform";

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
            expect(result.platform).toEqual(MoEPlatform.IOS);
            expect(result.accountMeta.appId).toEqual(appId);
        });

        it('Android payload should return MoELogoutCompleteData with android platform and correct appId', () => {
            const result = getLogoutCompleteData(JSON.parse(logoutCompleteAndroidPayload));
            expect(result).toBeInstanceOf(MoELogoutCompleteData);
            expect(result.platform).toEqual(MoEPlatform.Android);
            expect(result.accountMeta.appId).toEqual(appId);
        });
    });
});