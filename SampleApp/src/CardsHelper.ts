import ReactMoEngageCards from "react-native-moengage-cards";

import { MoEngageLogger } from "react-native-moengage";
import { CardsData, CardInfo, Card } from "react-native-moengage-cards";
import { MOENGAGE_APP_ID } from "./key";

class CardsHelper {

    appId = MOENGAGE_APP_ID;

    initialise(): void {
        ReactMoEngageCards.setSyncCompleteListener((data) => {
            MoEngageLogger.debug("App Open Sync Listener Called: ", data);
        });
        ReactMoEngageCards.initialize(this.appId);
    }

    refreshCards(): void {
        ReactMoEngageCards.refreshCards((data) => {
            MoEngageLogger.debug("Refresh Card Sync Listener Called: ", data);
        });
    }

    async getNewCardCount(): Promise<number> {
        const newCardsCount = await ReactMoEngageCards.getNewCardsCount();
        MoEngageLogger.debug("New Card Count : ", newCardsCount);
        return newCardsCount;
    }

    async getUnClickedCount(): Promise<number> {
        const unClickedCount = await ReactMoEngageCards.getUnClickedCardsCount();
        MoEngageLogger.debug("UnClicked Card Count : ", unClickedCount);
        return unClickedCount;
    }

    async getCardsCategory(): Promise<Array<string>> {
        const cardsCategory = await ReactMoEngageCards.getCardsCategories();
        MoEngageLogger.debug("Cards Categories: ", cardsCategory);
        return cardsCategory;
    }

    async isAllCategoryEnabled(): Promise<boolean> {
        const isAllCategoryEnabled = await ReactMoEngageCards.isAllCategoryEnabled();
        MoEngageLogger.debug("Is All Category Enabled ", isAllCategoryEnabled);
        return isAllCategoryEnabled;
    }

    async getCardForCategory(cardCategory): Promise<CardsData> {
        const cardsData = await ReactMoEngageCards.getCardsForCategory(cardCategory);
        MoEngageLogger.debug(`Cards For ${cardCategory} Category is fetched`);
        return cardsData;
    }

    async fetchCards(): Promise<CardsData> {
        const cardsData = await ReactMoEngageCards.fetchCards();
        MoEngageLogger.debug(`cards is fetched`);
        return cardsData;
    }

    async getCardsInfo(): Promise<CardInfo> {
        const cardInfo = await ReactMoEngageCards.getCardsInfo();
        MoEngageLogger.debug(`Cards Info is fetched`);
        return cardInfo;
    }

    onCardSectionLoaded(onSyncComplete: (data) => void): void {
        ReactMoEngageCards.onCardSectionLoaded((data) => {
            MoEngageLogger.debug("Card Section Sync Listener Called: ", data);
            onSyncComplete(data);
        });
    }

    onCardSectionUnLoaded(): void {
        ReactMoEngageCards.onCardSectionUnLoaded();
    }

    onCardShown(card: Card): void {
        ReactMoEngageCards.cardShown(card);
    }

    onCardClicked(card: Card, widgetId: number): void {
        ReactMoEngageCards.cardClicked(card, widgetId);
    }

    deletedCard(card: Card): void {
        ReactMoEngageCards.deleteCard(card);
    }

    cardDelivered(): void {
        ReactMoEngageCards.cardDelivered();
    }

    // Pending cardDelivered, deleteCards
}

export default CardsHelper;