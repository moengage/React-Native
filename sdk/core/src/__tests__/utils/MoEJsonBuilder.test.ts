import { appId, expectedUserIdentityStringObjectTypePayload, expectedUserIdentityStringTypePayload, userIdentityStringObjectType, userIdentityStringType } from "../../__mocks__/JsonDataProvider";
import { getIdentifyUserPayload } from "../../utils/MoEJsonBuilder";

describe('MoEJsonBuilder', () => {

    describe('getIdentifyUserPayload', () => {
        it('should return string identity mapped to uid', () => {
            expect(getIdentifyUserPayload(userIdentityStringType, appId)).toEqual(JSON.stringify(expectedUserIdentityStringTypePayload));
        });

        it('should return object identity', () => {
            expect(getIdentifyUserPayload(userIdentityStringObjectType, appId)).toEqual(JSON.stringify(expectedUserIdentityStringObjectTypePayload));
        });
    });
});