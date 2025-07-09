import { appId, expectedUserIdentityStringObjectTypePayload, expectedUserIdentityStringTypePayload, userIdentityStringObjectType, userIdentityStringType } from "../../__mocks__/JsonDataProvider";
import MoEngageLogger from "../../logger/MoEngageLogger";
import MoEInAppRules from "../../models/MoEInAppRules";
import { getDisplayRulesJson, getIdentifyUserPayload } from "../../utils/MoEJsonBuilder";

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

describe("getDisplayRulesJson", () => {
    // set mock for MoEngageLogger.verbose
    beforeEach(() => {
        jest.spyOn(MoEngageLogger, "verbose").mockImplementation(() => { });
    });

    // clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    var expectedDisplayRules = new MoEInAppRules("", [], []);

    it("should return a proper JSON object with contexts and screenNames are empty", () => {
        const result = getDisplayRulesJson(expectedDisplayRules);
        expect(result).toEqual({
            screenName: expectedDisplayRules.screenName,
            contexts: expectedDisplayRules.contexts,
            screenNames: expectedDisplayRules.screenNames,
        });
    });

    expectedDisplayRules = new MoEInAppRules("screen1", ["screen1", "screen2"], ["context1", "context2"]);

    it("should return a proper JSON object with contexts and screenNames", () => {
        const result = getDisplayRulesJson(expectedDisplayRules);
        expect(result).toEqual({
            screenName: expectedDisplayRules.screenName,
            contexts: expectedDisplayRules.contexts,
            screenNames: expectedDisplayRules.screenNames,
        });
    });
});