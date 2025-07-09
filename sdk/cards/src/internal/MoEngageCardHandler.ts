import { NativeEventEmitter } from "react-native";
import SyncCompleteData from "../model/SyncData";
import MoEngageCardsCache from "./MoEngageCardsCache";
import {
    getAllCategoryStatusFromPayload,
    getCardInfoFromPayload,
    getCardsCategoriesFromPayload,
    getCardsDataFromPayload,
    getCardsDataFromPayloadWithDefaultCategory,
    getNewCardCountFromPayload,
    getUnclickedCountFromPayload
} from "./utils/PayloadParser";
import CardInfo from "../model/CardInfo";
import Card from "../model/Card";
import CardsData from "../model/CardsData";
import {
    MODULE_TAG,
    keyData,
    keyPayload,
    keySyncCompleteData,
    argumentInboxOpenSync,
    argumentPullToRefreshSync,
    argumentGenericSync
} from "./Constants";
import { MoEngageLogger } from "react-native-moengage";
import { syncDataFromJson } from "./utils/JsonToModelMapper";
import MoEngageCardsBridge from '../NativeMoEngageCards';
import {
    getAccountMetaPayload,
    getCardClickedPayload,
    getCardShownPayload,
    getCardsForCategoriesPayload,
    getDeleteCardsPayload
} from "./utils/PayloadBuilder";
import CardListenerEvent from "../model/enums/CardListenerEvent";

let MoEngageEventEmitter: { addListener: (arg0: any, arg1: (data: any) => void) => void; };

/**
 * Helper class to connect the Public Card APIs to Platform specific bridge
 * 
 * @since 1.0.0
 * @author Abhishek Kumar
 */
class MoEngageCardHandler {

    private TAG = `${MODULE_TAG}MoEngageCardHandler`;

    private appId: string;

    constructor(appId: string) {
        this.appId = appId;
    }

    initialize(): void {
        try {
            if (MoEngageCardsBridge && MoEngageEventEmitter === undefined) {
                MoEngageEventEmitter = new NativeEventEmitter(MoEngageCardsBridge);
                this.addBridgeEventListener();
                MoEngageLogger.debug(`${this.TAG} Card Bridge Listener Added`);
            }
            MoEngageCardsBridge.initialize(getAccountMetaPayload(this.appId));
            MoEngageLogger.debug(`${this.TAG} Card Module Initialised with appId: `, this.appId);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} Error while initialising the Cards Plugin: `, error);
        }
    }

    refreshCards(onSyncComplete: (data: SyncCompleteData | null) => void): void {
        try {
            MoEngageCardsCache.cacheEventListenerCallback(CardListenerEvent.PULL_TO_REFRESH, onSyncComplete);
            MoEngageCardsBridge.refreshCards(getAccountMetaPayload(this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - refreshCards() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} refreshCards() `, error);
        }
    }

    onCardSectionLoaded(onSyncComplete: (data: SyncCompleteData | null) => void): void {
        try {
            MoEngageCardsCache.cacheEventListenerCallback(CardListenerEvent.INBOX_OPEN, onSyncComplete);
            MoEngageCardsBridge.onCardSectionLoaded(getAccountMetaPayload(this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - onCardSectionLoaded() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} onCardSectionLoaded() `, error);
        }
    }

    onCardSectionUnLoaded(): void {
        try {
            MoEngageCardsCache.removeCacheForEvent(CardListenerEvent.INBOX_OPEN);
            MoEngageCardsBridge.onCardSectionUnLoaded(getAccountMetaPayload(this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - onCardSectionUnLoaded() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} onCardSectionUnLoaded() `, error);
        }
    }

    async getCardsCategories(): Promise<Array<string>> {
        try {
            const categoriesPayload = await MoEngageCardsBridge.getCardsCategories(
               getAccountMetaPayload(this.appId)
            );
            const cardCategories = getCardsCategoriesFromPayload(categoriesPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - getCardsCategories() `, cardCategories);
            return cardCategories ?? [];
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} getCardsCategories() `, error);
            return [];
        }
    }

    async getCardsInfo(): Promise<CardInfo> {
        try {
            const cardInfoPayload = await MoEngageCardsBridge.getCardsInfo(
                getAccountMetaPayload(this.appId)
            );
            const cardInfo = getCardInfoFromPayload(cardInfoPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - getCardsInfo() `, cardInfo);
            return cardInfo;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} getCardsInfo() `, error);
            return new CardInfo(false, [], [], null);
        }
    }

    cardClicked(card: Card, widgetId: number): void {
        try {
            MoEngageCardsBridge.cardClicked(getCardClickedPayload(card, widgetId, this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - cardClicked() for widgetId`, widgetId);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} cardClicked() `, error);
        }
    }

    cardDelivered(): void {
        try {
            MoEngageCardsBridge.cardDelivered(getAccountMetaPayload(this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - cardDelivered() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} cardDelivered() `, error);
        }
    }

    cardShown(card: Card) {
        try {
            MoEngageCardsBridge.cardShown(getCardShownPayload(card, this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - cardShown() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} cardShown() `, error);
        }
    }

    async getCardsForCategory(category: string): Promise<CardsData> {
        try {
            const cardsDataPayload = await MoEngageCardsBridge.getCardsForCategory(
                getCardsForCategoriesPayload(category, this.appId)
            );
            const cardsData = getCardsDataFromPayload(cardsDataPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - getCardsForCategory() `, cardsData);
            return cardsData;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} getCardsForCategory() `, error);
            return new CardsData(category, [], null);
        }
    }

    async fetchCards(): Promise<CardsData> {
        try {
            const cardsDataPayload = await MoEngageCardsBridge.fetchCards(
                getAccountMetaPayload(this.appId)
            );
            const cardsData = getCardsDataFromPayloadWithDefaultCategory(cardsDataPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - fetchCards() `, cardsData);
            return cardsData;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} fetchCards() `, error);
            return new CardsData("", [], null);
        }
    }

    deleteCards(cards: Array<Card>) {
        try {
            MoEngageCardsBridge.deleteCards(getDeleteCardsPayload(cards, this.appId));
            MoEngageLogger.verbose(`${this.TAG} Executed - deleteCards() `);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} deleteCards() `, error);
        }
    }

    async isAllCategoryEnabled(): Promise<boolean> {
        try {
            const categoryStatusPayload = await MoEngageCardsBridge.isAllCategoryEnabled(
                getAccountMetaPayload(this.appId)
            );
            const isAllCategoryEnabled = getAllCategoryStatusFromPayload(categoryStatusPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - isAllCategoryEnabled() `, isAllCategoryEnabled);
            return isAllCategoryEnabled ?? false;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} isAllCategoryEnabled() `, error);
            return false;
        }
    }

    async getNewCardsCount(): Promise<number> {
        try {
            const newCardsCountPayload = await MoEngageCardsBridge.getNewCardsCount(
                getAccountMetaPayload(this.appId)
            );
            const newCardCount = getNewCardCountFromPayload(newCardsCountPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - getNewCardsCount() `, newCardCount);
            return newCardCount ?? 0;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} getNewCardsCount() `, error);
            return 0;
        }
    }

    async getUnClickedCardsCount(): Promise<number> {
        try {
            const unClickedCardsCountPayload = await MoEngageCardsBridge.getUnClickedCardsCount(
                getAccountMetaPayload(this.appId)
            );
            const unclickedCount = getUnclickedCountFromPayload(unClickedCardsCountPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - getUnClickedCardsCount() `, unclickedCount);
            return unclickedCount;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} getUnClickedCardsCount() `, error);
            return 0;
        }
    }

    private addBridgeEventListener(): void {
        MoEngageEventEmitter.addListener(
            argumentGenericSync,
            (data) => this.handleCallbackForSyncEvent(CardListenerEvent.GENERIC, data)
        );

        MoEngageEventEmitter.addListener(
            argumentPullToRefreshSync,
            (data) => this.handleCallbackForSyncEvent(CardListenerEvent.PULL_TO_REFRESH, data)
        );

        MoEngageEventEmitter.addListener(
            argumentInboxOpenSync,
            (data) => this.handleCallbackForSyncEvent(CardListenerEvent.INBOX_OPEN, data)
        );
    }

    private handleCallbackForSyncEvent(syncType: CardListenerEvent, data: { [k: string]: any }): void {
        try {
            const payload = data[keyPayload];
            const dataJson = JSON.parse(payload)[keyData];
            MoEngageLogger.verbose(`${this.TAG} handleCallbackForSyncEvent() `, dataJson);
            if (dataJson !== undefined) {
                const syncJson = dataJson[keySyncCompleteData];
                const syncCompleteData = syncJson !== undefined && syncJson != null ? syncDataFromJson(syncJson) : null;
                MoEngageLogger.debug(`${this.TAG} handleCallbackForSyncEvent(): Will try to emit callback for syncType = `, syncType);
                MoEngageCardsCache.getCallbackForCachedEvent(syncType)?.(syncCompleteData);
            }
        } catch (error) {
            MoEngageLogger.error(`handleCallbackForSyncEvent() SyncType: ${syncType} `, error);
        }
    }
}

export default MoEngageCardHandler;