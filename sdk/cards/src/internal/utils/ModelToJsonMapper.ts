/**
 * @file contains the function to convert the model to json
 * @author Abhishek Kumar
 * @since 1.0.0
 */

import CampaignState from "../../model/CampaignState";
import Card from "../../model/Card";
import CardInfo from "../../model/CardInfo";
import CardsData from "../../model/CardsData";
import Container from "../../model/Container";
import DisplayControl from "../../model/DisplayControl";
import MetaData from "../../model/MetaData";
import ShowTime from "../../model/ShowTime";
import SyncCompleteData from "../../model/SyncData";
import Template from "../../model/Template";
import Widget from "../../model/Widget";
import Action from "../../model/action/Action";
import NavigationAction from "../../model/action/NavigationAction";
import SyncType from "../../model/enums/SyncType";
import TemplateType from "../../model/enums/TemplateType";
import WidgetType from "../../model/enums/WidgetType";
import ButtonStyle from "../../model/styles/ButtonStyle";
import ContainerStyle from "../../model/styles/ContainerStyle";
import ImageStyle from "../../model/styles/ImageStyle";
import TextStyle from "../../model/styles/TextStyle";
import WidgetStyle from "../../model/styles/WidgetStyle";
import {
    keyActionType,
    keyActionValue,
    keyActions,
    keyAdditionalMetaData,
    keyBackgroundColor,
    keyCampaignPayload,
    keyCampaignState,
    keyCardId,
    keyCards,
    keyCategories,
    keyCategory,
    keyContainerId,
    keyContainerStyle,
    keyContainers,
    keyCreatedAt,
    keyDeletionTime,
    keyDisplayControl,
    keyEndTime,
    keyExpireAfterDelivered,
    keyExpireAfterSeen,
    keyExpireAt,
    keyFirstReceived,
    keyFirstSeen,
    keyFontSize,
    keyHasUpdates,
    keyId,
    keyIsClicked,
    keyIsNewCard,
    keyIsPinned,
    keyKVPairs,
    keyLocalShowCount,
    keyMaxCount,
    keyMetaData,
    keyNavigationType,
    keyShouldShowAllTab,
    keyShowTime,
    keyStartTime,
    keySyncType,
    keyTemplateData,
    keyTemplateType,
    keyTotalShowCount,
    keyUpdatedAt,
    keyWidgetContent,
    keyWidgetId,
    keyWidgetStyle,
    keyWidgetType,
    keyWidgets
} from "../Constants";
import { assertUnsupportedError } from "../utils/Util";
import { KEY_ACCESSIBILITY, MoEAccessibilityData } from "react-native-moengage";
import StaticImageType from "../../model/enums/StaticImageType";

export function actionToJson(action: Action): { [k: string]: any } {
    if (action instanceof NavigationAction) {
        return navigationActionToJson(action);
    }

    assertUnsupportedError("Action Instance Not Supported");
}

export function navigationActionToJson(navigationAction: NavigationAction): { [k: string]: any } {
    return {
        [keyActionType]: navigationAction.actionType,
        [keyNavigationType]: navigationAction.navigationType,
        [keyActionValue]: navigationAction.value,
        [keyKVPairs]: navigationAction.kvPairs
    };
}

export function buttonStyleToJson(buttonStyle: ButtonStyle): { [k: string]: any } {
    return {
        [keyBackgroundColor]: buttonStyle.backgroundColor,
        [keyFontSize]: buttonStyle.fontSize
    };
}

export function containerStyleToJson(containerStyle: ContainerStyle | undefined): { [k: string]: any } | undefined {
    if (containerStyle === undefined) return undefined;
    return {
        [keyBackgroundColor]: containerStyle.backgroundColor
    };
}

export function imageStyleToJson(imageStyle: ImageStyle): { [k: string]: any } {
    return {
        [keyBackgroundColor]: imageStyle.backgroundColor,
    };
}

export function textStyleToJson(textStyle: TextStyle): { [k: string]: any } {
    return {
        [keyBackgroundColor]: textStyle.backgroundColor,
        [keyFontSize]: textStyle.fontSize
    };
}

export function widgetStyleToJson(widgetStyle: WidgetStyle | undefined): { [k: string]: any } | undefined {
    if (widgetStyle === undefined) return undefined;
    if (widgetStyle instanceof ButtonStyle) {
        return buttonStyleToJson(widgetStyle);
    } else if (widgetStyle instanceof ContainerStyle) {
        return containerStyleToJson(widgetStyle);
    } else if (widgetStyle instanceof ImageStyle) {
        return imageStyleToJson(widgetStyle);
    } else if (widgetStyle instanceof TextStyle) {
        return textStyleToJson(widgetStyle);
    }

    assertUnsupportedError("WidgetStyle Instance Not Supported");
}

export function campaignStateToJson(campaignState: CampaignState): { [k: string]: any } {
    return {
        [keyLocalShowCount]: campaignState.localShowCount,
        [keyIsClicked]: campaignState.isClicked,
        [keyFirstReceived]: campaignState.firstReceived,
        [keyFirstSeen]: campaignState.firstSeen,
        [keyTotalShowCount]: campaignState.totalShowCount
    };
}

export function cardToJson(card: Card): { [k: string]: any } {
    return {
        [keyId]: card.id,
        [keyCardId]: card.cardId,
        [keyCategory]: card.category,
        [keyTemplateData]: templateToJson(card.template),
        [keyMetaData]: metaDataToJson(card.metaData)
    };
}

export function cardInfoToJson(cardInfo: CardInfo): { [k: string]: any } {
    return {
        [keyShouldShowAllTab]: cardInfo.shouldShowAllTab,
        [keyCategories]: cardInfo.categories,
        [keyCards]: cardInfo.cards.map((card) => {
            return cardToJson(card);
        }),
        [KEY_ACCESSIBILITY]: staticImageAccessibilityDataToJson(cardInfo.staticImageAccessibilityData)
    };
}

export function cardsDataToJson(cardsData: CardsData): { [k: string]: any } {
    return {
        [keyCategory]: cardsData.category,
        [keyCards]: cardsData.cards.map((card) => {
            return cardToJson(card);
        }),
        [KEY_ACCESSIBILITY]: staticImageAccessibilityDataToJson(cardsData.staticImageAccessibilityData)
    };
}

export function containerToJson(container: Container): { [k: string]: any } {
    return {
        [keyContainerId]: container.id,
        [keyTemplateType]: TemplateType[container.templateType],
        [keyContainerStyle]: containerStyleToJson(container.style),
        [keyWidgets]: container.widgets.map((widget) => {
            return widgetToJson(widget);
        }),
        [keyActions]: container.actionList.map((action) => {
            return actionToJson(action);
        })
    };
}

export function displayControlToJson(displayControl: DisplayControl): { [k: string]: any } {
    return {
        [keyExpireAt]: displayControl.expireAt,
        [keyExpireAfterSeen]: displayControl.expireAfterSeen,
        [keyExpireAfterDelivered]: displayControl.expireAfterDelivered,
        [keyMaxCount]: displayControl.maxCount,
        [keyIsPinned]: displayControl.isPinned,
        [keyShowTime]: showTimeToJson(displayControl.showTime)
    };
}

export function metaDataToJson(metaData: MetaData): { [k: string]: any } {
    return {
        [keyIsPinned]: metaData.isPinned,
        [keyIsNewCard]: metaData.isNewCard,
        [keyCampaignState]: campaignStateToJson(metaData.campaignState),
        [keyDeletionTime]: metaData.deletionTime,
        [keyDisplayControl]: displayControlToJson(metaData.displayControl),
        [keyAdditionalMetaData]: metaData.metaData,
        [keyUpdatedAt]: metaData.updatedTime,
        [keyCreatedAt]: metaData.createdAt,
        [keyCampaignPayload]: metaData.campaignPayload
    };
}

export function showTimeToJson(showTime: ShowTime): { [k: string]: any } {
    return {
        [keyStartTime]: showTime.startTime,
        [keyEndTime]: showTime.endTime
    };
}

export function syncDataToJson(syncData: SyncCompleteData): { [k: string]: any } {
    return {
        [keyHasUpdates]: syncData.hasUpdates,
        [keySyncType]: SyncType[syncData.syncType]
    };
}

export function templateToJson(template: Template): { [k: string]: any } {
    return {
        [keyTemplateType]: TemplateType[template.templateType],
        [keyContainers]: template.containers.map((container) => {
            return containerToJson(container);
        }),
        [keyKVPairs]: template.kvPairs
    };
}

export function widgetToJson(widget: Widget): { [k: string]: any } {
    return {
        [keyWidgetId]: widget.id,
        [keyWidgetContent]: widget.content,
        [keyWidgetType]: WidgetType[widget.widgetType],
        [keyWidgetStyle]: widgetStyleToJson(widget.style),
        [keyActions]: widget.actionList.map((action) => {
            return actionToJson(action);
        }),
        [KEY_ACCESSIBILITY]: widget.accessibilityData?.toJson() 
    };
}

export function staticImageAccessibilityDataToJson(staticImageAccessibilityData: { [key in StaticImageType]: MoEAccessibilityData } | null): { [key: string]: any } | null {
    return staticImageAccessibilityData ? 
        Object.fromEntries(
            Object.entries(staticImageAccessibilityData).map(([key, value]) => [key, value.toJson()])
        ) : null;
}