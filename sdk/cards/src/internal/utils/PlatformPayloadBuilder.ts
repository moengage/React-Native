import Card from "../../model/Card";
import {
    getAccountMetaPayload,
    getCardClickedPayload,
    getCardShownPayload,
    getCardsForCategoriesPayload,
    getDeleteCardsPayload
} from "./PayloadBuilder";

const PLATFORM_ANDROID = "android";
const PLATFORM_iOS = "ios";

/**
 * Class to build the Platform specific payload to communicate with the bridge
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class PlatformPayloadBuilder {

    private platform: string;
    private appId: string;

    constructor(platform: string, appId: string) {
        this.platform = platform;
        this.appId = appId;
    }

    getAccountMetaPayload(): string {
            return JSON.stringify(getAccountMetaPayload(this.appId));
    }

    getCardClickedPayload(card: Card, widgetId: number): string | { [k: string]: any } {
        if (this.platform === PLATFORM_ANDROID) {
            return JSON.stringify(getCardClickedPayload(card, widgetId, this.appId));
        } else if (this.platform === PLATFORM_iOS) {
            return getCardClickedPayload(card, widgetId, this.appId);
        } else {
            throw new Error("Platform Not Supported");
        }
    }

    getCardShowPayload(card: Card): string | { [k: string]: any } {
        if (this.platform === PLATFORM_ANDROID) {
            return JSON.stringify(getCardShownPayload(card, this.appId));
        } else if (this.platform === PLATFORM_iOS) {
            return getCardShownPayload(card, this.appId);
        } else {
            throw new Error("Platform Not Supported");
        }
    }

    getCardsForCategoriesPayload(category: string): string | { [k: string]: any } {
        if (this.platform === PLATFORM_ANDROID) {
            return JSON.stringify(getCardsForCategoriesPayload(category, this.appId));
        } else if (this.platform === PLATFORM_iOS) {
            return getCardsForCategoriesPayload(category, this.appId);
        } else {
            throw new Error("Platform Not Supported");
        }

    }

    getDeleteCardsPayload(cards: Array<Card>): string | { [k: string]: any } {
        if (this.platform === PLATFORM_ANDROID) {
            return JSON.stringify(getDeleteCardsPayload(cards, this.appId));
        } else if (this.platform === PLATFORM_iOS) {
            return getDeleteCardsPayload(cards, this.appId);
        } else {
            throw new Error("Platform Not Supported");
        }
    }
}

export default PlatformPayloadBuilder;