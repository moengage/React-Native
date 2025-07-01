/**
 * Enum representing different types of static images used in the application.
 * 
 * @since 6.0.0
 */
enum StaticImageType {
    /**
     * Image for No cards/Empty State
     */
    EMPTY_STATE = "no_cards",
    
    /**
     * Pin Card image
     */
    PIN_CARD = "pinned_card",
   
    /**
     * Place Holder image for card loading
     */
    LOADING_PLACE_HOLDER = "place_holder",
}

export default StaticImageType;