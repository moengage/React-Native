import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    /**
     * Initialize the Card Plugin
     * 
     * @param payload Stringified JSON payload.
     */
    initialize: (payload: string) => void;

    /**
     * Refresh the cards on user request
     * 
     * @param payload Stringified JSON payload.
    */
    refreshCards: (payload: string) => void;

    /**
     * Notify the MoEngage SDK that card section has loaded
     * 
     * @param payload Stringified JSON payload.
     * 
     */
    onCardSectionLoaded: (payload: string) => void;

    /**
    * Notify the MoEngage SDK that card section has unloaded
    * 
    * @param payload Stringified JSON payload.
    * 
    */
    onCardSectionUnLoaded: (payload: string) => void;

    /** 
     * Returns a list of categories to be shown
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains list of cards categories.
     */
    getCardsCategories(payload: string): Promise<string>;

    /** 
     * Returns a list of eligible cards for the provided category.
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains cards payload for given category
     */
    getCardsForCategory(payload: string): Promise<string>;

    /** 
     * Fetch all cards
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains cards payload
     * 
     */
    fetchCards(payload: string): Promise<string>;

    /** 
     * Return true if  All cards category should be shown
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains All cards category status.
     */
    isAllCategoryEnabled(payload: string): Promise<string>;

    /** 
     * Fetch count of new cards.
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains new cards count payload
     */
    getNewCardsCount(payload: string): Promise<string>;

    /** 
     * Fetch count of unclicked cards.
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains unclicked cards count payload.
     */
    getUnClickedCardsCount(payload: string): Promise<string>;

    /** 
     * Fetches all cards related data
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains cards related data payload.
     * 
     */
    getCardsInfo(payload: string): Promise<string>;

    /**
     *  Marks a card as clicked and tracks an event for statistical purpose
     * 
     * @param payload Stringified JSON payload.
     * 
     */
    cardClicked: (payload: string) => void;

    /** 
     * Track card delivery to inbox.
     * 
     * 
     * @param payload Stringified JSON payload.
     * @returns 
     */
    cardDelivered: (payload: string) => void;

    /** 
     * Track cards shown and update delivery counters accordingly
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns 
     */
    cardShown: (payload: string) => void;

    /** 
     * Deletes the multiple cards
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns 
     */
    deleteCards: (payload: string) => void;

    // Confirming to Native module interface
    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

const MoEngageCardsBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEngageCardsBridge');
export default MoEngageCardsBridge;