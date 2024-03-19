import {
    allCategoryEnabledJson,
    cardsDataJson,
    cardsInfoJson,
    cardsCategoriesJson,
    newCardCountJson,
    unclickedCountJson,
} from "../__mocks__/JsonDataProvider";
import {
    categoriesArray,
    cardsInfoObject,
    cardsDataObject
} from "../__mocks__/ModelClassProvider";
import {
    getAllCategoryStatusFromPayload,
    getCardInfoFromPayload,
    getCardsCategoriesFromPayload,
    getCardsDataFromPayload,
    getNewCardCountFromPayload,
    getUnclickedCountFromPayload
} from "../internal/utils/PayloadParser";

describe('PayloadParser', () => {
    describe('getCardsCategoriesFromPayload', () => {
        it('should return all categories', () => {
            expect(getCardsCategoriesFromPayload(JSON.stringify(cardsCategoriesJson))).toEqual(categoriesArray);
        });
    });

    describe('getAllCategoryStatusFromPayload', () => {
        it('should return all category state as true', () => {
            expect(getAllCategoryStatusFromPayload(JSON.stringify(allCategoryEnabledJson))).toEqual(true);
        });
    });

    describe('getNewCardCountFromPayload', () => {
        it('should return card count as 10', () => {
            expect(getNewCardCountFromPayload(JSON.stringify(newCardCountJson))).toEqual(10);
        });
    });

    describe('getUnclickedCountFromPayload', () => {
        it('should return card count as 10', () => {
            expect(getUnclickedCountFromPayload(JSON.stringify(unclickedCountJson))).toEqual(10);
        });
    });

    describe('getCardsDataFromPayload', () => {
        it('should return CardsData Object', () => {
            expect(getCardsDataFromPayload(JSON.stringify(cardsDataJson))).toEqual(cardsDataObject);
        });
    });

    describe('getCardInfoFromPayload', () => {
        it('should return CardsInfo Object', () => {
            expect(getCardInfoFromPayload(JSON.stringify(cardsInfoJson))).toEqual(cardsInfoObject);
        });
    });
});