import { userIdentityStringObjectType } from "../../__mocks__/JsonDataProvider";
import { getUserIdentitiesData } from "../../moeParser/MoEngagePayloadParser";

describe('MoEngagePayloadParser', () => {

    describe('getUserIdentitiesData', () => {
        it('payload data as null, function should return null', () => {
            expect(getUserIdentitiesData(null)).toEqual(null);
        });

        it('payload data as non-null, function should return the identities', () => {
            expect(getUserIdentitiesData(userIdentityStringObjectType.toString())).toEqual(userIdentityStringObjectType);
        });

        it('invalid payload data with number in identities, function should cast number to string and return the identities', () => {
            expect(getUserIdentitiesData({ "idKey1": 1 }.toString())).toEqual({ "idKey1": "1" });
        });
    });
});