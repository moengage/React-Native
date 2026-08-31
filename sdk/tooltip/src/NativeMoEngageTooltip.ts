import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

/**
 * Every method here takes only a `label` and, for the resolution ways, an id/text to match against —
 * never a coordinate or a measured rect from RN. The RN side of this module is just a wrapper/tag on
 * the target element; native resolves the real on-screen view and renders relative to it. That's
 * deliberate: a real tooltip is auto-triggered by the native Android/iOS SDK's own campaign
 * evaluation and must stay attached to a specific view, never a fixed screen position — this bridge
 * is shaped the same way, even though the trigger itself is a button press for this exploration.
 */
export interface Spec extends TurboModule {
    /**
     * Removes the bubble added by {@link findAndShowByNativeId} (renders via a decor-view overlay).
     */
    dismissOverlay: () => void;

    /**
     * Removes the window added by {@link findAndShowByAccessibilityLabel} (renders via a floating
     * WindowManager window).
     */
    dismissFloatingWindowOverlay: () => void;

    /**
     * viewresolution/nativetreewalk: native walks the real Android view tree from the Activity's
     * decor view looking for a `View` tagged with this `nativeID`, resolves its actual on-screen rect
     * itself ([android.view.View.getLocationOnScreen]), and renders a tooltip bubble attached to it —
     * no RN measurement involved, and never a fixed position.
     *
     * @param nativeId The `nativeID` prop value set on the target RN element.
     * @param label Text shown inside the tooltip bubble.
     */
    findAndShowByNativeId: (nativeId: string, label: string) => void;

    /**
     * viewresolution/accessibilitylabelwalk: same resolution idea as {@link findAndShowByNativeId},
     * but matches on `View.contentDescription` (RN's `accessibilityLabel` prop) instead of a
     * dedicated tag, and renders through a floating window instead of the decor view.
     */
    findAndShowByAccessibilityLabel: (text: string, label: string) => void;

    /**
     * nudge/beacon: resolves `nativeId` the same way as {@link findAndShowByNativeId}, then renders
     * a pulsating dot at a corner of the resolved view instead of a bubble — tapping the dot reveals
     * a tooltip card. JS only tags the element; native owns the dot, the pulse animation, and the
     * reveal/hide toggle.
     */
    findAndShowBeaconByNativeId: (nativeId: string, label: string) => void;

    /** Removes the beacon added by {@link findAndShowBeaconByNativeId}. */
    dismissBeacon: () => void;

    /**
     * nudge/spotlight: resolves `nativeId` the same way as {@link findAndShowByNativeId}, then
     * renders a full-screen dim scrim with a transparent cutout around the resolved view. Tap
     * anywhere to dismiss.
     */
    findAndShowSpotlightByNativeId: (nativeId: string) => void;

    /** Removes the spotlight added by {@link findAndShowSpotlightByNativeId}. */
    dismissSpotlight: () => void;

    /**
     * nudge/walkthrough: resolves each `nativeIds[i]` in order, showing one tooltip bubble per step
     * (paired 1:1 with `labels`). Tapping a step's bubble advances to the next; native owns the
     * entire sequence — JS calls this once with the full ordered list, never per step.
     */
    startWalkthroughByNativeIds: (nativeIds: Array<string>, labels: Array<string>) => void;

    /** Stops whichever walkthrough {@link startWalkthroughByNativeIds} started. */
    dismissWalkthrough: () => void;

    /**
     * nudge/coachmark: resolves each `nativeIds[i]` in order, dimming the whole screen and
     * re-drawing that step's resolved view above the scrim (no cutout) alongside a title/body
     * callout (paired 1:1 with `titles`/`bodies`). Tapping anywhere advances; native owns the entire
     * sequence — JS calls this once with the full ordered lists, never per step.
     */
    startCoachmarkByNativeIds: (
        nativeIds: Array<string>,
        titles: Array<string>,
        bodies: Array<string>
    ) => void;

    /** Stops whichever coachmark {@link startCoachmarkByNativeIds} started. */
    dismissCoachmark: () => void;

    // Required boilerplate for the RN built-in NativeEventEmitter contract (unused, no events emitted).
    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

const MoEngageTooltipBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngageTooltipBridge');
export default MoEngageTooltipBridge;
