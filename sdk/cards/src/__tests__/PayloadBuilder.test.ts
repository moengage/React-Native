import {
    accountMetaJson,
    appId,
    cardClickedJson,
    cardShowJson,
    deleteCardJson,
    getCardsForCategoryJson
} from "../__mocks__/JsonDataProvider";
import { categoriesArray, illustrationCardObject } from "../__mocks__/ModelClassProvider";
import {
    getAccountMetaPayload,
    getCardClickedPayload,
    getCardShownPayload,
    getCardsForCategoriesPayload,
    getDeleteCardsPayload
} from "../internal/utils/PayloadBuilder";

describe('PayloadBuilder', () => {
    describe('getAccountMetaPayload', () => {
        it('should return AccountMeta payload', () => {
            expect(getAccountMetaPayload(appId)).toEqual(JSON.stringify(accountMetaJson));
        });
    });

    describe('getCardClickedPayload', () => {
        it('should return CardClicked payload', () => {
            expect(getCardClickedPayload(illustrationCardObject, -1, appId)).toEqual(JSON.stringify(cardClickedJson));
        });
    });

    describe('getCardShowPayload', () => {
        it('should return CardShow payload', () => {
            expect(getCardShownPayload(illustrationCardObject, appId)).toEqual(JSON.stringify(cardShowJson));
        });
    });

    describe('getCardsForCategoriesPayload', () => {
        it('should return CardsForCategory payload', () => {
            expect(getCardsForCategoriesPayload(categoriesArray[0] ?? "", appId)).toEqual(JSON.stringify(getCardsForCategoryJson));
        });
    });

    describe('getDeleteCardsPayload', () => {
        it('should return DeleteCards payload', () => {
            expect(getDeleteCardsPayload([illustrationCardObject], appId)).toEqual(JSON.stringify(deleteCardJson));
        });
    });
});