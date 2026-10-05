/**
 * Recommended items returned for a recommendation campaign.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export default class RecommendedItems {

  /**
   * Recommended items, ranked best-first. Empty when there is nothing to recommend.
   *
   * Attribute keys and value types are defined by the dashboard catalog and are passed through
   * as-is, so keys are `snake_case` (e.g. `product_id`, `image_link`) and values can be strings,
   * numbers or booleans, and can differ between catalogs. Values are typed `unknown`, so narrow a
   * value's type before using it (e.g. `typeof item.price === "number"`).
   *
   * @since 1.0.0
   */
  items: Array<Record<string, unknown>>;

  constructor(items: Array<Record<string, unknown>>) {
    this.items = items;
  }
}
