import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    initialize:(payload: string) => void;

    refreshCards:(payload: string) => void;
    onCardSectionLoaded:(payload: string) => void;
    onCardSectionUnLoaded:(payload: string) => void;

    getCardsCategories(payload: string): Promise<Object | Error>;
    getCardsForCategory(payload: string): Promise<Object | Error>;
    fetchCards(payload: string): Promise<Object | Error>;
    isAllCategoryEnabled(payload: string): Promise<Object | Error>;
    getNewCardsCount(payload: string): Promise<Object | Error>;
    getUnClickedCardsCount(payload: string): Promise<Object | Error>;
  
    getCardsInfo(payload: string): Promise<Object | Error>;
    cardClicked:(payload: string) => void;
    cardDelivered:(payload: string) => void;
    cardShown:(payload: string) => void;
    deleteCards:(payload: string) => void;

    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

const MoEngageCardsBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngageCardsBridge');
export default MoEngageCardsBridge;