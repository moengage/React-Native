import ReactMoEngageCards from "react-native-moengage-cards";
import { MoEngageLogger } from "react-native-moengage";
import { CardsData, CardInfo, Card } from "react-native-moengage-cards";
import { MOENGAGE_APP_ID } from "./key";

class CardsHelper {
    initialise() {
        ReactMoEngageCards.initialize(MOENGAGE_APP_ID);
        MoEngageLogger.verbose("CardsScreen initialized, App id: " + MOENGAGE_APP_ID);
    }

    async getCardsCategory() {
        try {
            const cardsCategories = await ReactMoEngageCards.getCardsCategories();
            MoEngageLogger.debug("CardsCategories: ", cardsCategories);
            return cardsCategories;
        } catch (error) {
            MoEngageLogger.error("Error while getting cards category", error);
        }
    }

    async isAllCategoryEnabled() {
        try {
            const isAllCategoryEnabled = await ReactMoEngageCards.isAllCategoryEnabled();
            MoEngageLogger.debug("isAllCategoryEnabled: ", isAllCategoryEnabled);
            return isAllCategoryEnabled;
        } catch (error) {
            MoEngageLogger.error("Error while checking if all category is enabled", error);
        }
    }

    refreshCards() {
        try {
            ReactMoEngageCards.refreshCards((data) => {
                MoEngageLogger.debug("Cards refreshed successfully. Has updates: ", data?.hasUpdates);
            });
        } catch (error) {
            MoEngageLogger.error("Error while refreshing cards", error);
        }
    }

    async getNewCardCount() {
        try {
            const count = await ReactMoEngageCards.getNewCardsCount();
            MoEngageLogger.debug("New cards count: ", count);
            return count;
        } catch (error) {
            MoEngageLogger.error("Error while getting new cards count", error);
            return 0;
        }
    }

    async getUnClickedCount() {
        try {
            const count = await ReactMoEngageCards.getUnClickedCardsCount();
            MoEngageLogger.debug("Unclicked cards count: ", count);
            return count;
        } catch (error) {
            MoEngageLogger.error("Error while getting unclicked cards count", error);
            return 0;
        }
    }

    async fetchCards() {
        try {
            const cardsData = await ReactMoEngageCards.fetchCards();
            MoEngageLogger.debug("Cards: ", cardsData);
            return cardsData;
        } catch (error) {
            MoEngageLogger.error("Error while fetching cards", error);
        }
    }

    onCardClicked(clickedCard: Card, widgetId: number) {
        try {
            ReactMoEngageCards.cardClicked(clickedCard, widgetId);
            MoEngageLogger.debug("Card clicked event tracked");
        } catch (error) {
            MoEngageLogger.error("Error while tracking card click", error);
        }
    }

    onCardShown(shownCard: Card) {
        try {
            ReactMoEngageCards.cardShown(shownCard);
            MoEngageLogger.debug("Card shown event tracked");
        } catch (error) {
            MoEngageLogger.error("Error while tracking card shown", error);
        }
    }

    cardDelivered() {
        try {
            ReactMoEngageCards.cardDelivered();
            MoEngageLogger.debug("Card delivered event tracked");
        } catch (error) {
            MoEngageLogger.error("Error while tracking card delivery", error);
        }
    }

    deletedCard(card: Card) {
        try {
            ReactMoEngageCards.deleteCards([card]);
            MoEngageLogger.debug("Card deleted");
        } catch (error) {
            MoEngageLogger.error("Error while deleting card", error);
        }
    }

    onCardSectionLoaded(callback: (data: any) => void) {
        try {
            ReactMoEngageCards.onCardSectionLoaded(callback);
            MoEngageLogger.debug("Card section loaded listener set");
        } catch (error) {
            MoEngageLogger.error("Error while setting card section loaded listener", error);
        }
    }

    onCardSectionUnLoaded() {
        try {
            ReactMoEngageCards.onCardSectionUnLoaded();
            MoEngageLogger.debug("Card section unloaded");
        } catch (error) {
            MoEngageLogger.error("Error while unloading card section", error);
        }
    }
}

export default CardsHelper;