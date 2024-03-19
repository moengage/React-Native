import MetaData from "./MetaData";
import Template from "./Template";

/**
 * Card data
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class Card {

    /**
     * Internal SDK identifier.
     * @since 1.0.0
     */
    id: number;

    /**
     * Unique identifier for the campaign
     * @since 1.0.0
     */
    cardId: string;

    /**
     * Category to which the campaign belongs.
     * @since 1.0.0
     */
    category: string;

    /**
     * Template payload for the campaign.
     * @since 1.0.0
     */
    template: Template;

    /**
     * Meta data related to the campaign like status, delivery control etc.
     * @since 1.0.0
     */
    metaData: MetaData;

    constructor(id: number, cardId: string, category: string, template: Template, metaData: MetaData) {
        this.id = id;
        this.cardId = cardId;
        this.category = category;
        this.template = template;
        this.metaData = metaData;
    }
}

export default Card;