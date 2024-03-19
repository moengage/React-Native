/**
 * @file contains the function to build the payload to communicate with native bridge
 * @author Abhishek Kumar
 * @since 1.0.0
 */

import Card from "../../model/Card";
import {
    keyAccountMeta,
    keyAppId,
    keyCard,
    keyCards,
    keyCategory,
    keyData,
    keyWidgetIdentifier
} from "../Constants";
import { cardToJson } from "./ModelToJsonMapper";

export function getAccountMetaPayload(appId: string): { [k: string]: any } {
    return {
        [keyAccountMeta]: getAppIdPayload(appId)
    };
}

export function getCardClickedPayload(card: Card, widgetId: number, appId: string): { [k: string]: any } {
    return {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCard]: cardToJson(card),
            [keyWidgetIdentifier]: widgetId
        }
    };
}

export function getCardShownPayload(card: Card, appId: string): { [k: string]: any } {
    return {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCard]: cardToJson(card)
        }
    };
}

export function getCardsForCategoriesPayload(category: string, appId: string): { [k: string]: any } {
    return {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCategory]: category
        }
    };
}

export function getDeleteCardsPayload(cards: Array<Card>, appId: string): { [k: string]: any } {
    return {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCards]: cards.map((card) => {
                return cardToJson(card);
            })
        }
    };
}

function getAppIdPayload(appId: string): { [k: string]: any } {
    return {
        [keyAppId]: appId
    };
}