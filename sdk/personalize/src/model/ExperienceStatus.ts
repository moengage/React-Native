/**
 * Lifecycle status of an experience campaign on the MoEngage dashboard.
 *
 * @author MoEngage
 * @since 1.0.0
 */
export enum ExperienceStatus {
  /** Currently running. */
  ACTIVE = "active",
  /** Manually paused on the dashboard. */
  PAUSED = "paused",
  /** Scheduled to start in the future. */
  SCHEDULED = "scheduled",
}
