import {
    screenNavigationActionObject,
    deeplinkNavigationActionObject,
    richNavigationActionObject,
    textStyleObject,
    imageStyleObject,
    buttonStyleObject,
    containerStyleObject,
    campaignStateObject,
    buttonWidgetWithoutStyleObject,
    buttonWidgetWithStyleObject,
    imageWidgetWithoutStyleObject,
    textWidgetWithStyleObject,
    textWidgetWithoutStyleObject,
    illustrationContainerWithStyleObject,
    illustrationContainerWithoutStyleObject,
    basicContainerWithStyleObject,
    basicContainerWithoutStyleObject,
    basicTemplateObject,
    illustrationTemplateObject,
    showTimeWithValueObject,
    showTimeWithoutValueObject,
    displayControlObject,
    syncCompleteDataPullToRefreshObject,
    syncCompleteDataAppOpenObject,
    syncCompleteDataInboxOpenObject,
    metaDataObject,
    illustrationCardObject,
    basicCardObject,
    cardsInfoObject,
    cardsDataObject,
    imageWidgeWithStyleObject,
} from "../__mocks__/ModelClassProvider";
import {
    basicCardJson,
    basicContainerJson,
    basicContainerWithoutStyleJson,
    basicTemplateJson,
    buttonWidgetWithStyleJson,
    buttonWidgetWithoutStyleJson,
    campaignStateJson,
    cardDataJson,
    cardInfoJson,
    deeplinkActionJson,
    displayControlJson,
    illustrationCardJson,
    illustrationContainerJson,
    illustrationContainerWithoutStyleJson,
    illustrationTemplateJson,
    imageWidgetWithStyleJson,
    imageWidgetWithoutStylJson,
    metaDataJson,
    richLandingActionJson,
    screenNameActionJson,
    showTimeWithEmptyValueJson,
    showTimeWithValidValueJson,
    styleWithColorJson,
    styleWithSizeAndColorJson,
    syncCompleteDataAppOpenJson,
    syncCompleteDataInboxOpenJson,
    syncCompleteDataPullToRefreshJson,
    textWidgetWithStyleJson,
    textWidgetWithoutStylJson
} from "../__mocks__/JsonDataProvider";
import {
    actionToJson,
    campaignStateToJson,
    cardInfoToJson,
    cardToJson,
    cardsDataToJson,
    containerToJson,
    displayControlToJson,
    metaDataToJson,
    showTimeToJson,
    syncDataToJson,
    templateToJson,
    widgetStyleToJson,
    widgetToJson
} from "../internal/utils/ModelToJsonMapper";

describe('ModelToJsonMapper', () => {

    describe('actionToJson', () => {
        it('should return valid NavigateAction json with ScreenName type', () => {
            expect(actionToJson(screenNavigationActionObject)).toEqual(screenNameActionJson);
        });

        it('should return valid NavigateAction json with Deeplink type', () => {
            expect(actionToJson(deeplinkNavigationActionObject)).toEqual(deeplinkActionJson);
        });

        it('should return valid NavigateAction json with RichLanding type', () => {
            expect(actionToJson(richNavigationActionObject)).toEqual(richLandingActionJson);
        });
    });

    describe('widgetStyleToJson', () => {
        it('should return valid Header Text Widget Style', () => {
            expect(widgetStyleToJson(textStyleObject))
                .toEqual(styleWithSizeAndColorJson);
        });

        it('should return valid Image Widget Style', () => {
            expect(widgetStyleToJson(imageStyleObject))
                .toEqual(styleWithColorJson);
        });

        it('should return valid Button Widget Style', () => {
            expect(widgetStyleToJson(buttonStyleObject))
                .toEqual(styleWithSizeAndColorJson);
        });

        it('should return valid Container Widget Style', () => {
            expect(widgetStyleToJson(containerStyleObject))
                .toEqual(styleWithColorJson);
        });
    });

    describe('campaignStateToJson', () => {
        it('should return valid Campaign Json', () => {
            expect(campaignStateToJson(campaignStateObject))
                .toEqual(campaignStateJson);
        });
    });

    describe('widgetToJson', () => {
        it('Button widget with style json', () => {
            expect(widgetToJson(buttonWidgetWithStyleObject))
                .toEqual(buttonWidgetWithStyleJson);
        });

        it('Button widget without style json', () => {
            expect(widgetToJson(buttonWidgetWithoutStyleObject))
                .toEqual(buttonWidgetWithoutStyleJson);
        });

        it('Image widget with style json', () => {
            expect(widgetToJson(imageWidgeWithStyleObject))
                .toEqual(imageWidgetWithStyleJson);
        });

        it('Image widget without style json', () => {
            expect(widgetToJson(imageWidgetWithoutStyleObject))
                .toEqual(imageWidgetWithoutStylJson);
        });

        it('Text widget with style json', () => {
            expect(widgetToJson(textWidgetWithStyleObject))
                .toEqual(textWidgetWithStyleJson);
        });

        it('Text widget without style json', () => {
            expect(widgetToJson(textWidgetWithoutStyleObject))
                .toEqual(textWidgetWithoutStylJson);
        });
    });

    describe('containerToJson', () => {
        it('Illustration Container with style', () => {
            expect(containerToJson(illustrationContainerWithStyleObject))
                .toEqual(illustrationContainerJson);
        });

        it('Illustration Container without style', () => {
            expect(containerToJson(illustrationContainerWithoutStyleObject))
                .toEqual(illustrationContainerWithoutStyleJson);
        });

        it('Basic Container with style', () => {
            expect(containerToJson(basicContainerWithStyleObject))
                .toEqual(basicContainerJson);
        });

        it('Basic Container without style', () => {
            expect(containerToJson(basicContainerWithoutStyleObject))
                .toEqual(basicContainerWithoutStyleJson);
        });
    });

    describe('templateToJson', () => {
        it('Illustration Template', () => {
            expect(templateToJson(illustrationTemplateObject))
                .toEqual(illustrationTemplateJson);
        });

        it('Basic Template', () => {
            expect(templateToJson(basicTemplateObject))
                .toEqual(basicTemplateJson);
        });
    });

    describe('showTimeToJson', () => {
        it('ShowTime with value', () => {
            expect(showTimeToJson(showTimeWithValueObject))
                .toEqual(showTimeWithValidValueJson);
        });

        it('ShowTime with empty value', () => {
            expect(showTimeToJson(showTimeWithoutValueObject))
                .toEqual(showTimeWithEmptyValueJson);
        });
    });

    describe('displayControlToJson', () => {
        it('DisplayControl with valid value', () => {
            expect(displayControlToJson(displayControlObject))
                .toEqual(displayControlJson);
        });
    });

    describe('metaDataToJson', () => {
        it('should return valid MetaData json', () => {
            expect(metaDataToJson(metaDataObject))
                .toEqual(metaDataJson);
        });
    });

    describe('syncDataToJson', () => {
        it('Pull to refresh', () => {
            expect(syncDataToJson(syncCompleteDataPullToRefreshObject))
                .toEqual(syncCompleteDataPullToRefreshJson);
        });

        it('App open', () => {
            expect(syncDataToJson(syncCompleteDataAppOpenObject))
                .toEqual(syncCompleteDataAppOpenJson);
        });

        it('Inbox open', () => {
            expect(syncDataToJson(syncCompleteDataInboxOpenObject))
                .toEqual(syncCompleteDataInboxOpenJson);
        });
    });

    describe('cardToJson', () => {
        it('should return valid Illustraction card json', () => {
            expect(cardToJson(illustrationCardObject))
                .toEqual(illustrationCardJson);
        });

        it('should return valid Basic card object', () => {
            expect(cardToJson(basicCardObject))
                .toEqual(basicCardJson);
        });
    });

    describe('cardInfoToJson', () => {
        it('should return valid CardsInfo json', () => {
            expect(cardInfoToJson(cardsInfoObject))
                .toEqual(cardInfoJson);
        });
    });

    describe('cardsDataToJson', () => {
        it('should return valid CardsData Json', () => {
            expect(cardsDataToJson(cardsDataObject))
                .toEqual(cardDataJson);
        });
    });
});