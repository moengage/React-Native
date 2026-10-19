import RecommendedItems from "./model/RecommendedItems";
import RecommendationsFailure from "./model/RecommendationsFailure";
import {
  RecommendationsFailureReason,
  RecommendationsSpecificFailureReason
} from "./model/RecommendationsFailureReason";
import MoEngageRecommendationsHandler from "./internal/MoEngageRecommendationsHandler";
import { MoEngageLogger } from "react-native-moengage";
import { MODULE_TAG } from "./internal/Constants";

/**
 * Public API for the MoEngage Recommendations module. Each instance is scoped to a single
 * MoEngage workspace (app id) — multiple workspaces should each instantiate their own.
 *
 * @author MoEngage
 * @since 1.0.0
 */
class ReactMoEngageRecommendations {

  private readonly TAG = `${MODULE_TAG}ReactMoEngageRecommendations`;

  private handler: MoEngageRecommendationsHandler;

  /**
   * Construct a recommendations instance for the given workspace.
   *
   * @param appId The MoEngage workspace identifier.
   * @since 1.0.0
   */
  constructor(appId: string) {
    MoEngageLogger.debug(`${this.TAG} constructor() : appId=${appId}`);
    this.handler = new MoEngageRecommendationsHandler(appId);
  }

  /**
   * Fetches the recommended items for a recommendation id.
   *
   * Items are served from the local cache while an unexpired entry exists; otherwise the SDK
   * fetches them from the server and caches the response.
   *
   * @param recommendationId Recommendation ID defined on the dashboard. Must not be blank.
   * @param itemId Item ID defined on the dashboard. Ignored when blank.
   * @param includedFields Fields to return for each item, over and above the core fields.
   * Ignored when empty. Duplicates are dropped.
   * @returns Promise resolving to {@link RecommendedItems}. An empty item list is a success — it
   * means there are no recommendations for this user.
   * @throws Rejects with {@link RecommendationsFailure} on failure.
   * @since 1.0.0
   */
  fetchRecommendations(
    recommendationId: string,
    itemId: string = "",
    includedFields: string[] = []
  ): Promise<RecommendedItems> {
    MoEngageLogger.verbose(`${this.TAG} fetchRecommendations() : `);
    return this.handler.fetchRecommendations(recommendationId, itemId, includedFields);
  }
}

export {
  RecommendedItems,
  RecommendationsFailure,
  RecommendationsFailureReason,
  RecommendationsSpecificFailureReason,
};

export default ReactMoEngageRecommendations;
