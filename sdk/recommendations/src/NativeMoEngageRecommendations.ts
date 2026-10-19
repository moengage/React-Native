import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
    /**
     * Fetches the recommended items for a recommendation id.
     *
     * @param payload Stringified JSON payload.
     * @returns {Promise<string>} A promise that contains the recommended items. Rejects with the
     * failure reason as the error code on failure.
     */
    fetchRecommendations(payload: string): Promise<string>;
}

const MoEngageRecommendationsBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngageRecommendationsBridge');
export default MoEngageRecommendationsBridge;
