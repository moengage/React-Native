/**
 * @file contains the function to build the object from json
 * @author Abhishek Kumar
 * @since 1.0.0
 */

import CardInfo from "../../model/CardInfo";
import CardsData from "../../model/CardsData";
import {
    keyCategories,
    keyCategory,
    keyData,
    keyIsAllCategoryEnabled,
    keyNewCardsCount,
    keyUnClickedCardsCount
} from "../Constants";
import { cardInfoFromJson, cardsDataFromJson } from "./JsonToModelMapper";

export function getCardsCategoriesFromPayload(payload: Object): Array<string> {
    const categoriesJson = payload[keyData];
    return categoriesJson[keyCategories];
}

export function getCardInfoFromPayload(payload: Object): CardInfo {
    const cardsInfoJson = payload[keyData];
    return cardInfoFromJson(cardsInfoJson);
}

export function getCardsDataFromPayload(payload: Object): CardsData {
    const cardsDataJson = payload[keyData];
    return cardsDataFromJson(cardsDataJson);
}

export function getCardsDataFromPayloadWithDefaultCategory(payload: Object): CardsData {
    const cardsDataJson = payload[keyData];
    cardsDataJson[keyCategory] = "All";
    return cardsDataFromJson(cardsDataJson);
}

export function getAllCategoryStatusFromPayload(payload: Object): boolean {
    const statusJson = payload[keyData];
    return statusJson[keyIsAllCategoryEnabled];
}

export function getNewCardCountFromPayload(payload: Object): number {
    const cardCountJson = payload[keyData];
    return cardCountJson[keyNewCardsCount];
}

export function getUnclickedCountFromPayload(payload: Object): number {
    const unclickedCountJson = payload[keyData];
    return unclickedCountJson[keyUnClickedCardsCount];
}