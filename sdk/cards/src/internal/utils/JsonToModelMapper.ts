/**
 * @file contains the function to get the model from json
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
import ActionType from "../../model/enums/ActionType";
import NavigationType from "../../model/enums/NavigationType";
import SyncType from "../../model/enums/SyncType";
import TemplateType from "../../model/enums/TemplateType";
import WidgetType from "../../model/enums/WidgetType";
import ButtonStyle from "../../model/styles/ButtonStyle";
import ContainerStyle from "../../model/styles/ContainerStyle";
import ImageStyle from "../../model/styles/ImageStyle";
import TextStyle from "../../model/styles/TextStyle";
import WidgetStyle from "../../model/styles/WidgetStyle";
import {
    defaultContainerBgColor,
    defaultFontSize,
    defaultTextBgColor,
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
    keyContainerType,
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
import { assertUnsupportedError, getEnumByName } from "../utils/Util";
import StaticImageType from "../../model/enums/StaticImageType";
import { MoEAccessibilityData, KEY_ACCESSIBILITY } from "react-native-moengage";

export function actionFromJson(json: { [k: string]: any }): Action {
    const navigationType: ActionType = getEnumByName(ActionType, json[keyActionType] ?? "");
    switch (navigationType) {
        case ActionType.NAVIGATE:
            return navigationActionFromJson(json);
        default:
            assertUnsupportedError("Action Type Not Supported");
    }
}

export function navigationActionFromJson(json: { [k: string]: any }): NavigationAction {
    return new NavigationAction(
        ActionType.NAVIGATE,
        getEnumByName<NavigationType>(NavigationType, json[keyNavigationType]),
        json[keyActionValue],
        json[keyKVPairs]
    );
}

export function widgetStyleFromJson(json: { [k: string]: any }, widgetType: WidgetType): WidgetStyle | undefined {
    switch (widgetType) {
        case WidgetType.TEXT:
            return textStyleFromJson(json);
        case WidgetType.BUTTON:
            return buttonStyleFromJson(json);
        case WidgetType.IMAGE:
            return imageStyleFromJson(json);
        default:
            assertUnsupportedError("Widget Type Not Supported");
    }
}

export function buttonStyleFromJson(json: { [k: string]: any }): ButtonStyle | undefined {
    if (json === undefined || json === null) return undefined;
    return new ButtonStyle(
        json[keyBackgroundColor] ?? defaultTextBgColor,
        json[keyFontSize] ?? defaultFontSize
    );
}

export function containerStyleFromJson(json: { [k: string]: any }): ContainerStyle | undefined {
    if (json === undefined || json === null) return undefined;
    return new ContainerStyle(
        json[keyBackgroundColor] ?? defaultContainerBgColor
    );
}

export function imageStyleFromJson(json: { [k: string]: any }): ImageStyle | undefined {
    if (json === undefined || json === null) return undefined;
    return new ImageStyle(
        json[keyBackgroundColor] ?? defaultTextBgColor
    );
}

export function textStyleFromJson(json: { [k: string]: any }): TextStyle | undefined {
    if (json === undefined || json === null) return undefined;
    return new TextStyle(
        json[keyBackgroundColor] ?? defaultTextBgColor,
        json[keyFontSize] ?? defaultFontSize
    );
}

export function campaignStateFromJson(json: { [k: string]: any }): CampaignState {
    return new CampaignState(
        json[keyLocalShowCount] ?? 0,
        json[keyIsClicked] ?? false,
        json[keyFirstReceived] ?? -1,
        json[keyFirstSeen] ?? -1,
        json[keyTotalShowCount] ?? 0
    );
}

export function cardFromJson(json: { [k: string]: any }): Card {
    return new Card(
        json[keyId] ?? -1,
        json[keyCardId],
        json[keyCategory] ?? "",
        templateFromJson(json[keyTemplateData]),
        metaDataFromJson(json[keyMetaData])
    );
}

export function cardInfoFromJson(json: { [k: string]: any }): CardInfo {
    return new CardInfo(
        json[keyShouldShowAllTab] ?? false,
        json[keyCategories] ?? [],
        Array.from((json[keyCards] ?? []) as Iterable<{ [k: string]: any }>)
            .map((cardJson) => {
                return cardFromJson(cardJson);
            }),
        staticImageFromJson(json[KEY_ACCESSIBILITY] ?? undefined),
    );
}

export function cardsDataFromJson(json: { [k: string]: any }): CardsData {
    return new CardsData(
        json[keyCategory],
        Array.from((json[keyCards] ?? []) as Iterable<{ [k: string]: any }>)
            .map((cardObject) => {
                return cardFromJson(cardObject);
            }),
        staticImageFromJson(json[KEY_ACCESSIBILITY] ?? undefined),
    );
}

export function containerFromJson(json: { [k: string]: any }): Container {
    return new Container(
        json[keyContainerId],
        getEnumByName<TemplateType>(TemplateType, json[keyContainerType]),
        containerStyleFromJson(json[keyContainerStyle]),
        Array.from((json[keyWidgets] ?? []) as Array<{ [k: string]: any }>)
            .map((widget) => {
                return widgetFromJson(widget);
            }),
        Array.from((json[keyActions] ?? []) as Array<{ [k: string]: any }>)
            .map((action) => {
                return actionFromJson(action);
            })
    );
}

export function displayControlFromJson(json: { [k: string]: any }): DisplayControl {
    return new DisplayControl(
        json[keyExpireAt] ?? -1,
        json[keyExpireAfterSeen] ?? -1,
        json[keyExpireAfterDelivered] ?? -1,
        json[keyMaxCount] ?? 0,
        json[keyIsPinned] ?? false,
        showTimeFromJson(json[keyShowTime] ?? {})
    );
}

export function metaDataFromJson(json: { [k: string]: any }): MetaData {
    const displayControl = displayControlFromJson(json[keyDisplayControl] ?? {});
    return new MetaData(
        displayControl.isPinned,
        json[keyIsNewCard] ?? false,
        campaignStateFromJson(json[keyCampaignState] ?? {}),
        json[keyDeletionTime],
        displayControl,
        json[keyAdditionalMetaData] ?? {},
        json[keyCreatedAt] ?? -1,
        json[keyUpdatedAt] ?? -1,
        json[keyCampaignPayload] ?? {},
    );
}

export function showTimeFromJson(json: { [k: string]: any }): ShowTime {
    return new ShowTime(
        json[keyStartTime],
        json[keyEndTime]
    );
}

export function syncDataFromJson(json: { [k: string]: any }): SyncCompleteData {
    return new SyncCompleteData(
        json[keyHasUpdates] ?? false,
        getEnumByName<SyncType>(SyncType, json[keySyncType])
    );
}

export function templateFromJson(json: { [k: string]: any }): Template {
    return new Template(
        getEnumByName<TemplateType>(TemplateType, json[keyTemplateType]),
        Array.from((json[keyContainers] ?? []) as Array<{ [k: string]: any }>)
            .map((container) => {
                return containerFromJson(container);
            }),
        json[keyKVPairs]
    );
}

export function widgetFromJson(json: { [k: string]: any }): Widget {
    const widgetType = getEnumByName<WidgetType>(WidgetType, json[keyWidgetType]);
    return new Widget(
        json[keyWidgetId],
        widgetType,
        json[keyWidgetContent],
        widgetStyleFromJson(json[keyWidgetStyle], widgetType),
        Array.from((json[keyActions] ?? []) as Iterable<{ [k: string]: any }>)
            .map((action) => {
                return actionFromJson(action);
            }),
        json[KEY_ACCESSIBILITY] != null ? MoEAccessibilityData.fromJson(json[KEY_ACCESSIBILITY]) : undefined,
    );
}

export function staticImageFromJson(json: { [k: string]: any } | undefined): { [key in StaticImageType]: MoEAccessibilityData } | undefined {
    if (!json) {
        return undefined
    }
    const result: { [key in StaticImageType]?: MoEAccessibilityData } = {};
    for (const type of Object.values(StaticImageType)) {
        if (json[type]) {
            result[type as StaticImageType] = MoEAccessibilityData.fromJson(json[type]);
        }
    }
    return result as { [key in StaticImageType]: MoEAccessibilityData };
}