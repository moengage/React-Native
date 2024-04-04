import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    initialize:(payload: string) => void;

    refreshCards:(payload: string) => void;
    onCardSectionLoaded:(payload: string) => void;
    onCardSectionUnLoaded:(payload: string) => void;

    getCardsCategories(payload: string): Promise<string>;
    getCardsForCategory(payload: string): Promise<string>;
    fetchCards(payload: string): Promise<string>;
    isAllCategoryEnabled(payload: string): Promise<string>;
    getNewCardsCount(payload: string): Promise<string>;
    getUnClickedCardsCount(payload: string): Promise<string>;
  
    getCardsInfo(payload: string): Promise<string>;
    cardClicked:(payload: string) => void;
    cardDelivered:(payload: string) => void;
    cardShown:(payload: string) => void;
    deleteCards:(payload: string) => void;

    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

const MoEngageCardsBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngageCardsBridge');
export default MoEngageCardsBridge;