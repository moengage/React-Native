// Filename: src/<featureNameCamel>PublicApi.ts
import { MoEngageLogger } from "react-native-moengage";
import MoEngage<featureNameCamel>Handler from "./internal/MoEngage<featureNameCamel>Handler";

let handler: MoEngage<featureNameCamel>Handler | null = null;

const ReactMoEngage<featureNameCamel> = {

    initialize: function(appId: string): void {
        MoEngageLogger.verbose("Will initialize <featureNameCamel>");
        handler = new MoEngage<featureNameCamel>Handler(appId);
        // Wire up event listeners here if nativeToHybrid events exist
    },

    // Fire-and-forget method:
    <methodName>: function(<params>): void {
        MoEngageLogger.verbose("Will call <methodName>");
        handler?.<methodName>(<params>);
    },

    // Promise method:
    <methodName>: async function(<params>): Promise<<ReturnType>> {
        MoEngageLogger.verbose("Will call <methodName>");
        return handler?.<methodName>(<params>) ?? <defaultValue>;
    },

};

export default ReactMoEngage<featureNameCamel>;
