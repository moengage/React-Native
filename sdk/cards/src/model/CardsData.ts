import Card from "./Card";

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

    constructor(category: string, cards: Array<Card>) {
        this.category = category;
        this.cards = cards;
    }
}

export default CardsData;