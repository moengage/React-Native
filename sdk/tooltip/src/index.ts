/**
 * @file Entry for the MoEngage Tooltip Exploration Plugin.
 *
 * Every export here passes only a label/id to native — never a coordinate or a measured view. RN's
 * role is just to wrap/tag the target element (or hold a `TooltipAnchorView` around it); native
 * resolves the real on-screen view and stays attached to it. That mirrors how a real tooltip is
 * auto-triggered by the native Android/iOS SDK's own campaign evaluation, never by RN measuring a
 * view and handing native a rect.
 *
 * @author Abhishek Kumar
 * @since 0.0.1
 */
import MoEngageTooltipBridge from './NativeMoEngageTooltip';
import TooltipAnchorView from './TooltipAnchorView';
import type { TooltipAnchorViewProps } from './TooltipAnchorView';

/** Dismisses whatever {@link findAndShowByNativeId} is showing (renders via a decor-view overlay). */
export function dismissOverlay(): void {
    MoEngageTooltipBridge.dismissOverlay();
}

/** Dismisses whatever {@link findAndShowByAccessibilityLabel} is showing (a floating window). */
export function dismissFloatingWindowOverlay(): void {
    MoEngageTooltipBridge.dismissFloatingWindowOverlay();
}

/** viewresolution/nativetreewalk — native resolves the view by tag, no ref/measure round-trip. */
export function findAndShowByNativeId(nativeId: string, label: string): void {
    MoEngageTooltipBridge.findAndShowByNativeId(nativeId, label);
}

/** viewresolution/accessibilitylabelwalk. */
export function findAndShowByAccessibilityLabel(text: string, label: string): void {
    MoEngageTooltipBridge.findAndShowByAccessibilityLabel(text, label);
}

/** nudge/beacon — pulsating dot resolved by nativeID; tap reveals a tooltip card. */
export function findAndShowBeaconByNativeId(nativeId: string, label: string): void {
    MoEngageTooltipBridge.findAndShowBeaconByNativeId(nativeId, label);
}

/** Dismisses whatever {@link findAndShowBeaconByNativeId} is showing. */
export function dismissBeacon(): void {
    MoEngageTooltipBridge.dismissBeacon();
}

/** nudge/spotlight — full-screen dim scrim with a cutout resolved by nativeID. */
export function findAndShowSpotlightByNativeId(nativeId: string): void {
    MoEngageTooltipBridge.findAndShowSpotlightByNativeId(nativeId);
}

/** Dismisses whatever {@link findAndShowSpotlightByNativeId} is showing. */
export function dismissSpotlight(): void {
    MoEngageTooltipBridge.dismissSpotlight();
}

/** nudge/walkthrough — sequence of nativeIDs, one tooltip per step; native owns stepping. */
export function startWalkthroughByNativeIds(nativeIds: string[], labels: string[]): void {
    MoEngageTooltipBridge.startWalkthroughByNativeIds(nativeIds, labels);
}

/** Stops whichever walkthrough {@link startWalkthroughByNativeIds} started. */
export function dismissWalkthrough(): void {
    MoEngageTooltipBridge.dismissWalkthrough();
}

/** nudge/coachmark — sequence of nativeIDs, target lifted above a dim scrim; native owns stepping. */
export function startCoachmarkByNativeIds(nativeIds: string[], titles: string[], bodies: string[]): void {
    MoEngageTooltipBridge.startCoachmarkByNativeIds(nativeIds, titles, bodies);
}

/** Stops whichever coachmark {@link startCoachmarkByNativeIds} started. */
export function dismissCoachmark(): void {
    MoEngageTooltipBridge.dismissCoachmark();
}

export { TooltipAnchorView };
export type { TooltipAnchorViewProps };
