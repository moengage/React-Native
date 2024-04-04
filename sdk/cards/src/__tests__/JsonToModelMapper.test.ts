import {
    actionFromJson,
    campaignStateFromJson,
    containerStyleFromJson,
    widgetStyleFromJson,
    widgetFromJson,
    containerFromJson,
    templateFromJson,
    showTimeFromJson,
    syncDataFromJson,
    metaDataFromJson,
    cardFromJson,
    cardInfoFromJson,
    displayControlFromJson,
    cardsDataFromJson
} from "../internal/utils/JsonToModelMapper";
import WidgetType from "../model/enums/WidgetType";
import {
    screenNavigationActionObject,
    deeplinkNavigationActionObject,
    richNavigationActionObject,
    textStyleObject,
    imageStyleObject,
    buttonStyleObject,
    containerStyleObject,
    campaignStateObject,
    campaignStateWithDefaultObject,
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
    campaignStateWithoutKeyJson,
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

describe('JsonToModelMapper', () => {

    describe('actionFromJson', () => {
        it('should return valid NavigateAction object with ScreenName type', () => {
            expect(actionFromJson(screenNameActionJson)).toEqual(screenNavigationActionObject);
        });

        it('should return valid NavigateAction object with Deeplink type', () => {
            expect(actionFromJson(deeplinkActionJson)).toEqual(deeplinkNavigationActionObject);
        });

        it('should return valid NavigateAction object with RichLanding type', () => {
            expect(actionFromJson(richLandingActionJson)).toEqual(richNavigationActionObject);
        });
    });

    describe('widgetStyleFromJson', () => {
        it('should return valid Header Text Widget Style', () => {
            expect(widgetStyleFromJson(styleWithSizeAndColorJson, WidgetType.TEXT))
                .toEqual(textStyleObject);
        });

        it('should return valid Image Widget Style', () => {
            expect(widgetStyleFromJson(styleWithColorJson, WidgetType.IMAGE))
                .toEqual(imageStyleObject);
        });

        it('should return valid Button Widget Style', () => {
            expect(widgetStyleFromJson(styleWithSizeAndColorJson, WidgetType.BUTTON))
                .toEqual(buttonStyleObject);
        });

        it('should return valid Container Widget Style', () => {
            expect(containerStyleFromJson(styleWithColorJson))
                .toEqual(containerStyleObject);
        });
    });

    describe('campaignStateFromJson', () => {
        it('should return valid Campaign Object', () => {
            expect(campaignStateFromJson(campaignStateJson))
                .toEqual(campaignStateObject);
        });

        it('should return default Campaign Object', () => {
            expect(campaignStateFromJson(campaignStateWithoutKeyJson))
                .toEqual(campaignStateWithDefaultObject);
        });
    });

    describe('widgetFromJson', () => {
        it('Button widget with style json', () => {
            expect(widgetFromJson(buttonWidgetWithStyleJson))
                .toEqual(buttonWidgetWithStyleObject);
        });

        it('Button widget without style json', () => {
            expect(widgetFromJson(buttonWidgetWithoutStyleJson))
                .toEqual(buttonWidgetWithoutStyleObject);
        });

        it('Image widget with style json', () => {
            expect(widgetFromJson(imageWidgetWithStyleJson))
                .toEqual(imageWidgeWithStyleObject);
        });

        it('Image widget without style json', () => {
            expect(widgetFromJson(imageWidgetWithoutStylJson))
                .toEqual(imageWidgetWithoutStyleObject);
        });

        it('Text widget with style json', () => {
            expect(widgetFromJson(textWidgetWithStyleJson))
                .toEqual(textWidgetWithStyleObject);
        });

        it('Text widget without style json', () => {
            expect(widgetFromJson(textWidgetWithoutStylJson))
                .toEqual(textWidgetWithoutStyleObject);
        });
    });

    describe('containerFromJson', () => {
        it('Illustration Container with style', () => {
            expect(containerFromJson(illustrationContainerJson))
                .toEqual(illustrationContainerWithStyleObject);
        });

        it('Illustration Container without style', () => {
            expect(containerFromJson(illustrationContainerWithoutStyleJson))
                .toEqual(illustrationContainerWithoutStyleObject);
        });

        it('Basic Container with style', () => {
            expect(containerFromJson(basicContainerJson))
                .toEqual(basicContainerWithStyleObject);
        });

        it('Basic Container without style', () => {
            expect(containerFromJson(basicContainerWithoutStyleJson))
                .toEqual(basicContainerWithoutStyleObject);
        });
    });

    describe('templateFromJson', () => {
        it('Illustration Template', () => {
            expect(templateFromJson(illustrationTemplateJson))
                .toEqual(illustrationTemplateObject);
        });

        it('Basic Template', () => {
            expect(templateFromJson(basicTemplateJson))
                .toEqual(basicTemplateObject);
        });
    });

    describe('showTimeFromJson', () => {
        it('ShowTime with value', () => {
            expect(showTimeFromJson(showTimeWithValidValueJson))
                .toEqual(showTimeWithValueObject);
        });

        it('ShowTime with empty value', () => {
            expect(showTimeFromJson(showTimeWithEmptyValueJson))
                .toEqual(showTimeWithoutValueObject);
        });
    });

    describe('displayControlFromJson', () => {
        it('DisplayControl with valid value', () => {
            expect(displayControlFromJson(displayControlJson))
                .toEqual(displayControlObject);
        });
    });

    describe('metaDataFromJson', () => {
        it('should return valid MetaData object', () => {
            expect(metaDataFromJson(metaDataJson))
                .toEqual(metaDataObject);
        });
    });

    describe('syncDataFromJson', () => {
        it('Pull to refresh', () => {
            expect(syncDataFromJson(syncCompleteDataPullToRefreshJson))
                .toEqual(syncCompleteDataPullToRefreshObject);
        });

        it('App open', () => {
            expect(syncDataFromJson(syncCompleteDataAppOpenJson))
                .toEqual(syncCompleteDataAppOpenObject);
        });

        it('Inbox open', () => {
            expect(syncDataFromJson(syncCompleteDataInboxOpenJson))
                .toEqual(syncCompleteDataInboxOpenObject);
        });
    });

    describe('cardFromJson', () => {
        it('should return valid Illustraction card object', () => {
            expect(cardFromJson(illustrationCardJson))
                .toEqual(illustrationCardObject);
        });

        it('should return valid Basic card object', () => {
            expect(cardFromJson(basicCardJson))
                .toEqual(basicCardObject);
        });
    });

    describe('cardInfoFromJson', () => {
        it('should return valid CardsInfo object', () => {
            expect(cardInfoFromJson(cardInfoJson))
                .toEqual(cardsInfoObject);
        });
    });

    describe('cardsDataFromJson', () => {
        it('should return valid CardsData object', () => {
            expect(cardsDataFromJson(cardDataJson))
                .toEqual(cardsDataObject);
        });
    });
});