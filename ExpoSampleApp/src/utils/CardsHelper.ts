import ReactMoEngageCards from "react-native-moengage-cards";

import { CardsData, CardInfo, Card } from "react-native-moengage-cards";
import { WORKSPACE_ID } from "../key";

class CardsHelper {

    appId = WORKSPACE_ID;

    initialise(): void {
        ReactMoEngageCards.setSyncCompleteListener((data) => {
            console.log("App Open Sync Listener Called: ", data);
        });
        ReactMoEngageCards.initialize(this.appId);
    }

    refreshCards(): void {
        ReactMoEngageCards.refreshCards((data) => {
            console.log("Refresh Card Sync Listener Called: ", data);
        });
    }

    async getNewCardCount(): Promise<number> {
        const newCardsCount = await ReactMoEngageCards.getNewCardsCount();
        console.log("New Card Count : ", newCardsCount);
        return newCardsCount;
    }

    async getUnClickedCount(): Promise<number> {
        const unClickedCount = await ReactMoEngageCards.getUnClickedCardsCount();
        console.log("UnClicked Card Count : ", unClickedCount);
        return unClickedCount;
    }

    async getCardsCategory(): Promise<Array<string>> {
        const cardsCategory = await ReactMoEngageCards.getCardsCategories();
        console.log("Cards Categories: ", cardsCategory);
        return cardsCategory;
    }

    async isAllCategoryEnabled(): Promise<boolean> {
        const isAllCategoryEnabled = await ReactMoEngageCards.isAllCategoryEnabled();
        console.log("Is All Category Enabled ", isAllCategoryEnabled);
        return isAllCategoryEnabled;
    }

    async getCardForCategory(cardCategory: string): Promise<CardsData> {
        const cardsData = await ReactMoEngageCards.getCardsForCategory(cardCategory);
        console.log(`Cards For ${cardCategory} Category is fetched`);
        return cardsData;
    }

    async fetchCards(): Promise<CardsData> {
        const cardsData = await ReactMoEngageCards.fetchCards();
        console.log(`cards is fetched`);
        return cardsData;
    }

    async getCardsInfo(): Promise<CardInfo> {
        const cardInfo = await ReactMoEngageCards.getCardsInfo();
        console.log(`Cards Info is fetched`);
        return cardInfo;
    }

    onCardSectionLoaded(onSyncComplete: (data: any) => void): void {
        ReactMoEngageCards.onCardSectionLoaded((data: any) => {
            console.log("Card Section Sync Listener Called: ", data);
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
}

export default CardsHelper;