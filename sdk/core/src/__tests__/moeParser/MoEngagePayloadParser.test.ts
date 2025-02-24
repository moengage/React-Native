import { userIdentityStringObjectType } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData } from "../../moeParser/MoEngagePayloadParser";

describe('MoEngagePayloadParser', () => {

    describe('getUserIdentitiesData', () => {
        it('payload data as null, function should return null', () => {
            expect(getUserIdentitiesData(null)).toEqual(null);
        });

        it('payload data as non-null, function should return the identities', () => {
            expect(getUserIdentitiesData(JSON.stringify(userIdentityStringObjectType))).toEqual(userIdentityStringObjectType);
        });
    });
});