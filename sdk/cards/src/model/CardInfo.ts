import Card from "./Card";
import StaticImageType from "./enums/StaticImageType";
import { MoEAccessibilityData } from "react-native-moengage";

/**
 * All data for cards.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class CardInfo {

    /**
     * True is showing ALL tabs is enabled else false.
     * @since 1.0.0
     */
    shouldShowAllTab: boolean;

    /**
     * All configured categories for cards.
     * @since 1.0.0
     */
    categories: Array<string>;

    /**
     * All cards which are eligible for display currently.
     * @since 1.0.0
     */
    cards: Array<Card>;

    /**
     * Accessibility data for static images used in cards.
     * 
     * @since 6.0.0
     */ 
    staticImageAccessibilityData:  { [key in StaticImageType]: MoEAccessibilityData } | null;

    constructor(shouldShowAllTab: boolean, categories: Array<string>, cards: Array<Card>, staticImageAccessibilityData:  { [key in StaticImageType]: MoEAccessibilityData } | null) {
        this.shouldShowAllTab = shouldShowAllTab;
        this.categories = categories;
        this.cards = cards;
        this.staticImageAccessibilityData = staticImageAccessibilityData;
    }
}

export default CardInfo;