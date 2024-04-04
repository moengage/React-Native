import {
    accountMetaJson,
    appId,
    cardClickedJson,
    cardShowJson,
    deleteCardJson,
    getCardsForCategoryJson,
} from "../__mocks__/JsonDataProvider";
import { categoriesArray, illustrationCardObject } from "../__mocks__/ModelClassProvider";
import PlatformPayloadBuilder from "../internal/utils/PlatformPayloadBuilder";

describe('PlatformPayloadBuilder', () => {
    const androidPlatformBuilder = new PlatformPayloadBuilder("android", appId);
    const iOSPlatformBuilder = new PlatformPayloadBuilder("ios", appId);
    const webPlatformBuilder = new PlatformPayloadBuilder("web", appId);

    describe('getAccountMetaPayload', () => {
        it('should return AccountMeta payload for android', () => {
            expect(androidPlatformBuilder.getAccountMetaPayload()).toEqual(JSON.stringify(accountMetaJson));
        });

        it('should return AccountMeta payload for ios', () => {
            expect(iOSPlatformBuilder.getAccountMetaPayload()).toEqual(accountMetaJson);
        });

        it('should throw error for web', () => {
            expect(() => { webPlatformBuilder.getAccountMetaPayload() }).toThrow("Platform Not Supported");
        });
    });

    describe('getCardClickedPayload', () => {
        it('should return CardClicked payload for android', () => {
            expect(androidPlatformBuilder.getCardClickedPayload(illustrationCardObject, -1)).toEqual(JSON.stringify(cardClickedJson));
        });

        it('should return CardClicked payload for ios', () => {
            expect(iOSPlatformBuilder.getCardClickedPayload(illustrationCardObject, -1)).toEqual(cardClickedJson);
        });

        it('should throw error for web', () => {
            expect(() => { webPlatformBuilder.getCardClickedPayload(illustrationCardObject, -1) }).toThrow("Platform Not Supported");
        });
    });

    describe('getCardsForCategoriesPayload', () => {
        it('should return CardsForCategory payload for android', () => {
            expect(androidPlatformBuilder.getCardsForCategoriesPayload(categoriesArray[0] ?? "")).toEqual(JSON.stringify(getCardsForCategoryJson));
        });

        it('should return CardsForCategory payload for ios', () => {
            expect(iOSPlatformBuilder.getCardsForCategoriesPayload(categoriesArray[0] ?? "")).toEqual(getCardsForCategoryJson);
        });

        it('should throw error for web', () => {
            expect(() => { webPlatformBuilder.getCardsForCategoriesPayload(categoriesArray[0] ?? "") }).toThrow("Platform Not Supported");
        });
    });

    describe('getDeleteCardsPayload', () => {
        it('should return DeleteCards payload for android', () => {
            expect(androidPlatformBuilder.getDeleteCardsPayload([illustrationCardObject])).toEqual(JSON.stringify(deleteCardJson));
        });

        it('should return DeleteCards payload for ios', () => {
            expect(iOSPlatformBuilder.getDeleteCardsPayload([illustrationCardObject])).toEqual(deleteCardJson);
        });

        it('should throw error for web', () => {
            expect(() => { webPlatformBuilder.getDeleteCardsPayload([illustrationCardObject]) }).toThrow("Platform Not Supported");
        });
    });

    describe('getCardShowPayload', () => {
        it('should return CardShow payload for android', () => {
            expect(androidPlatformBuilder.getCardShowPayload(illustrationCardObject)).toEqual(JSON.stringify(cardShowJson));
        });

        it('should return CardShow payload for ios', () => {
            expect(iOSPlatformBuilder.getCardShowPayload(illustrationCardObject)).toEqual(cardShowJson);
        });

        it('should throw error for web', () => {
            expect(() => { webPlatformBuilder.getCardShowPayload(illustrationCardObject) }).toThrow("Platform Not Supported");
        });
    });
});