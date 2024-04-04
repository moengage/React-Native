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

export function getAccountMetaPayload(appId: string) {
    let payload =  { 
        [keyAccountMeta] : getAppIdPayload(appId)
    };

    return JSON.stringify(payload);
}

export function getCardClickedPayload(card: Card, widgetId: number, appId: string) {
    let payload =  {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCard]: cardToJson(card),
            [keyWidgetIdentifier]: widgetId
        }
    }

    return JSON.stringify(payload);
}

export function getCardShownPayload(card: Card, appId: string) {
    let payload =  {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCard]: cardToJson(card)
        }
    }

    return JSON.stringify(payload);
}

export function getCardsForCategoriesPayload(category: string, appId: string) {
    let payload =  {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCategory]: category
        }
    }

    return JSON.stringify(payload);
}

export function getDeleteCardsPayload(cards: Array<Card>, appId: string) {
   let payload = {
        [keyAccountMeta]: getAppIdPayload(appId),
        [keyData]: {
            [keyCards]: cards.map((card) => {
                return cardToJson(card);
            })
        }
    }

    return JSON.stringify(payload);
}

function getAppIdPayload(appId: string) {
    let payload = { 
        [keyAppId] : appId
    };
    
    return payload
}