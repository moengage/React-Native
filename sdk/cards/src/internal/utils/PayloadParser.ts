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

export function getCardsCategoriesFromPayload(payload: string): Array<string> {
    const categoriesJson = JSON.parse(payload)[keyData];
    return categoriesJson[keyCategories];
}

export function getCardInfoFromPayload(payload: string): CardInfo {
    const cardsInfoJson = JSON.parse(payload)[keyData];
    return cardInfoFromJson(cardsInfoJson);
}

export function getCardsDataFromPayload(payload: string): CardsData {
    const cardsDataJson = JSON.parse(payload)[keyData];
    return cardsDataFromJson(cardsDataJson);
}

export function getCardsDataFromPayloadWithDefaultCategory(payload: string): CardsData {
    const cardsDataJson = JSON.parse(payload)[keyData];
    cardsDataJson[keyCategory] = "All";
    return cardsDataFromJson(cardsDataJson);
}

export function getAllCategoryStatusFromPayload(payload: string): boolean {
    const statusJson = JSON.parse(payload)[keyData];
    return statusJson[keyIsAllCategoryEnabled];
}

export function getNewCardCountFromPayload(payload: string): number {
    const cardCountJson = JSON.parse(payload)[keyData];
    return cardCountJson[keyNewCardsCount];
}

export function getUnclickedCountFromPayload(payload: string): number {
    const unclickedCountJson = JSON.parse(payload)[keyData];
    return unclickedCountJson[keyUnClickedCardsCount];
}