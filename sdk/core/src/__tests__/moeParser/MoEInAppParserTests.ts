import { getMoEInAppRules } from "../../scr/../moeParser/MoEInAppParser";
import MoEInAppRules from "../../models/MoEInAppRules";
import { MOE_INAPP_CONTEXTS, MOE_INAPP_SCREEN_NAMES } from "../../utils/MoEConstants";

describe("getMoEInAppRules", () => {
    it("should return rules with provided screenNames and contexts", () => {
        const sampleContexts = ["context1" ];
        const sampleScreenNames = ["screen1" ];
        const jsonInput = {
            [MOE_INAPP_CONTEXTS]: sampleContexts,
            [MOE_INAPP_SCREEN_NAMES]: sampleScreenNames,
        };
        const result = getMoEInAppRules(jsonInput);
        expect(result).toBeInstanceOf(MoEInAppRules);
        expect(result.screenNames).toEqual(sampleScreenNames);
        expect(result.contexts).toEqual(sampleContexts);
    });

    it("should return rules with provided screenNames and contexts", () => {
        const sampleScreenNames = ["home", "profile"];
        const sampleContexts = ["context1", "context2" ];
        const jsonInput = {
            [MOE_INAPP_SCREEN_NAMES]: sampleScreenNames,
            [MOE_INAPP_CONTEXTS]: sampleContexts,
        };
        const result = getMoEInAppRules(jsonInput);
        expect(result).toBeInstanceOf(MoEInAppRules);
        expect(result.screenNames).toEqual(sampleScreenNames);
        expect(result.contexts).toEqual(sampleContexts);
    });

    it("should return rules when screenNames and contexts are empty", () => {
        const jsonInput = {
            [MOE_INAPP_SCREEN_NAMES]: [],
            [MOE_INAPP_CONTEXTS]: [],
        };
        const result = getMoEInAppRules(jsonInput);
        expect(result).toBeInstanceOf(MoEInAppRules);
        expect(result.screenNames).toEqual([]);
        expect(result.contexts).toEqual([]);
    });
});