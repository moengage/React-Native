/**
 * Source from which an experience campaign or its metadata was retrieved.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export enum DataSource {
  /** Returned from local cache. */
  CACHE = "CACHE",
  /** Fetched from the MoEngage backend. */
  NETWORK = "NETWORK",
}
