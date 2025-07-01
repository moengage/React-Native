import Card from "./Card";
import StaticImageType from "./enums/StaticImageType";
import { MoEAccessibilityData } from "react-native-moengage";

/**
 * Data for cards
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class CardsData {

    /**
     * Category for the cards
     * @since 1.0.0
     */
    category: string;

    /**
     * [List] of [Card]
     * @since 1.0.0
     */
    cards: Array<Card>;

    /**
     * Accessibility data for static images used in cards.
     * 
     * @since 6.0.0
     */
    staticImageAccessibilityData:  { [key in StaticImageType]: MoEAccessibilityData } | undefined;


    constructor(category: string, cards: Array<Card>, staticImageAccessibilityData?: { [key in StaticImageType]: MoEAccessibilityData }) {
        this.category = category;
        this.cards = cards;
        this.staticImageAccessibilityData = staticImageAccessibilityData;
    }
}

export default CardsData;