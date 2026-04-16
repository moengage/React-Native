import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    /**
     * Fetches experience campaign metadata filtered by status.
     *
     * @param payload Stringified JSON payload.
     * @returns {Promise<string>} A promise that contains experience metadata.
     */
    fetchExperiencesMeta(payload: string): Promise<string>;

    /**
     * Fetches experience campaigns for the given keys and optional attributes.
     *
     * @param payload Stringified JSON payload.
     * @returns {Promise<string>} A promise that contains experiences and failures.
     */
    fetchExperiences(payload: string): Promise<string>;

    /**
     * Tracks impression events for one or more experience campaigns.
     *
     * @param payload Stringified JSON payload.
     */
    trackExperienceShown(payload: string): void;

    /**
     * Tracks a click event for a single experience campaign.
     *
     * @param payload Stringified JSON payload.
     */
    trackExperienceClicked(payload: string): void;

    /**
     * Tracks impression events for one or more offerings.
     *
     * @param payload Stringified JSON payload.
     */
    trackOfferingShown(payload: string): void;

    /**
     * Tracks a click event for a single offering within an experience campaign.
     *
     * @param payload Stringified JSON payload.
     */
    trackOfferingClicked(payload: string): void;
}

const MoEngagePersonalizeBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngagePersonalizeBridge');
export default MoEngagePersonalizeBridge;
