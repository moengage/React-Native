import Card from "./Card";

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

    constructor(shouldShowAllTab: boolean, categories: Array<string>, cards: Array<Card>) {
        this.shouldShowAllTab = shouldShowAllTab;
        this.categories = categories;
        this.cards = cards;
    }
}

export default CardInfo;