import MoEngageRecommendationsBridge from "../NativeMoEngageRecommendations";
import RecommendedItems from "../model/RecommendedItems";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG } from "./Constants";
import * as PayloadBuilder from "./utils/PayloadBuilder";
import * as Parser from "./utils/PayloadParser";

/**
 * Helper class that translates Public Recommendations APIs into native bridge calls.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class MoEngageRecommendationsHandler {

    private TAG = `${MODULE_TAG}MoEngageRecommendationsHandler`;

    private appId: string;

    constructor(appId: string) {
        this.appId = appId;
        MoEngageLogger.debug(`${this.TAG} constructor() : initialised for appId=${appId}`);
    }

    async fetchRecommendations(
        recommendationId: string,
        itemId: string,
        includedFields: string[]
    ): Promise<RecommendedItems> {
        try {
            const payload = PayloadBuilder.buildFetchRecommendationsPayload(
                this.appId, recommendationId, itemId, includedFields
            );
            MoEngageLogger.verbose(`${this.TAG} fetchRecommendations() : ${payload}`);
            const response = await MoEngageRecommendationsBridge.fetchRecommendations(payload);
            return Parser.parseRecommendedItems(response);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} fetchRecommendations() : `, error);
            throw Parser.parseRecommendationsFailure(error);
        }
    }
}
