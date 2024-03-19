import { MODULE_TAG } from "./internal/Constants";
import MoEngageCardHandler from "./internal/MoEngageCardHandler";
import MoEngageCardsCache from "./internal/MoEngageCardsCache";
import Card from "./model/Card";
import CardInfo from "./model/CardInfo";
import CardsData from "./model/CardsData";
import SyncCompleteData from "./model/SyncData";
import { MoEngageLogger } from "react-native-moengage";
import SyncType from "./model/enums/SyncType";

/**
 * Helper to interact with the cards feature.
 * 
 * @since 1.0.0
 * @author Abhishek Kumar
 */
namespace ReactMoEngageCards {

    const TAG = `${MODULE_TAG}ReactMoEngageCards`;

    let moEngageCardHandler: MoEngageCardHandler;

    /**
     * Initialize the Card Plugin
     * 
     * @param {string} appId - MoEngage AppId
     * @since 1.0.0
     */
    export function initialize(appId: string): void {
        MoEngageLogger.verbose(`${TAG} initialize() : `);
        moEngageCardHandler = new MoEngageCardHandler(appId);
        moEngageCardHandler.initialize();
    }

    /**
     * Set a listener to receive callback for cards refresh on App open
     * Notes: This method must be call before initialize to get callback properly
     * 
     * @param onSyncComplete - Callback to be trigger on sync complete
     * @since 1.0.0
     */
    export function setAppOpenSyncListener(onSyncComplete: (data: SyncCompleteData | null) => void): void {
        MoEngageLogger.verbose(`${TAG} setAppOpenSyncListener() : `);
        MoEngageCardsCache.cacheEventListenerCallback(SyncType.APP_OPEN, onSyncComplete);
    }

    /**
     * Refresh the cards on user request
     * 
     * @param onSyncComplete - Callback to be trigger on sync complete
     * @since 1.0.0
     */
    export function refreshCards(onSyncComplete: (data: SyncCompleteData | null) => void): void {
        MoEngageLogger.verbose(`${TAG} refreshCards() : `);
        moEngageCardHandler?.refreshCards(onSyncComplete);
    }

    /**
     * Notify the MoEngage SDK that card section has loaded
     * 
     * @since 1.0.0
     */
    export function onCardSectionLoaded(onSyncComplete: (data: SyncCompleteData | null) => void): void {
        MoEngageLogger.verbose(`${TAG} onCardSectionLoaded() : `);
        moEngageCardHandler?.onCardSectionLoaded(onSyncComplete);
    }

    /**
     * Notifies the SDK that the inbox view is gone to the background
     * 
     * @since 1.0.0
     */
    export function onCardSectionUnLoaded(): void {
        MoEngageLogger.verbose(`${TAG} onCardSectionUnLoaded() : `);
        moEngageCardHandler?.onCardSectionUnLoaded();
    }

    /**
     * Returns a list of categories to be shown
     * 
     * @returns list of category
     * @since 1.0.0
     */
    export async function getCardsCategories(): Promise<Array<string>> {
        MoEngageLogger.verbose(`${TAG} getCardsCategories() : `);
        return moEngageCardHandler?.getCardsCategories();
    }

    /**
     * Fetches all cards related data
     * 
     * @return instance of {@link CardInfo}
     * @since 1.0.0
     */
    export async function getCardsInfo(): Promise<CardInfo> {
        MoEngageLogger.verbose(`${TAG} getCardsInfo() : `);
        return moEngageCardHandler?.getCardsInfo();
    }

    /**
     * Returns a list of eligible cards for the provided category.
     * To fetch all cards irrespective of categories pass in the category as [All]
     *
     * @param {string} category - category for which cards should be fetched.
     * @returns instance of {@link CardsData}
     * @since 1.0.0
     */
    export async function getCardsForCategory(category: string): Promise<CardsData> {
        MoEngageLogger.verbose(`${TAG} getCardsForCategory() : `);
        return moEngageCardHandler?.getCardsForCategory(category);
    }

    /**
     * fetch all cards
     *
     * @returns instance of {@link CardsData}
     * @since 1.0.0
     */
    export async function fetchCards(): Promise<CardsData> {
        MoEngageLogger.verbose(`${TAG} fetchCards() : `);
        return moEngageCardHandler?.fetchCards();
    }

    /**
     * Deletes the multiple cards
     *
     * @param {Array<Card>} cards - all the cards which need to be deleted
     * @since 1.0.0
     */
    export function deleteCards(cards: Array<Card>): void {
        MoEngageLogger.verbose(`${TAG} deleteCards() : `);
        moEngageCardHandler?.deleteCards(cards);
    }

    /**
     * Deletes the single cards
     *
     * @param {Card} cards - cards which need to be deleted
     * @since 1.0.0
     */
    export function deleteCard(card: Card): void {
        MoEngageLogger.verbose(`${TAG} deleteCard() : `);
        moEngageCardHandler?.deleteCards([card]);
    }

    /**
     * Return true if  All cards category should be shown
     * 
     * @since 1.0.0
     */
    export async function isAllCategoryEnabled(): Promise<boolean> {
        MoEngageLogger.verbose(`${TAG} isAllCategoryEnabled() : `);
        return moEngageCardHandler?.isAllCategoryEnabled();
    }

    /**
     * Marks a card as clicked and tracks an event for statistical purpose
     *
     * @param {Card} card - cards which is clicked
     * @param {number} widgetId - unique identifier for the widget that was clicked. 
     * @since 1.0.0
     */
    export function cardClicked(card: Card, widgetId: number): void {
        MoEngageLogger.verbose(`${TAG} cardClicked() : `);
        moEngageCardHandler?.cardClicked(card, widgetId);
    }

    /**
     * Track card delivery to inbox.
     * 
     * @since 1.0.0
     */
    export function cardDelivered(): void {
        MoEngageLogger.verbose(`${TAG} cardDelivered() : `);
        moEngageCardHandler?.cardDelivered();
    }

    /**
     * Fetch count of new cards.
     * 
     * @returns number of new cards
     * @since 1.0.0
     */
    export async function getNewCardsCount(): Promise<number> {
        MoEngageLogger.verbose(`${TAG} getNewCardsCount() : `);
        return moEngageCardHandler?.getNewCardsCount();
    }

    /**
     * Fetch count of unclicked cards.
     * 
     * @returns number of unclicked cards
     * @since 1.0.0
     */
    export async function getUnClickedCardsCount(): Promise<number> {
        MoEngageLogger.verbose(`${TAG} getUnClickedCardsCount() : `);
        return moEngageCardHandler?.getUnClickedCardsCount();
    }

    /**
     * Track cards shown and update delivery counters accordingly
     * 
     * @param {Card} card - card which is shown to user
     * @since 1.0.0
     */
    export function cardShown(card: Card): void {
        MoEngageLogger.verbose(`${TAG} cardShown() : `);
        moEngageCardHandler.cardShown(card);
    }
}

export default ReactMoEngageCards;