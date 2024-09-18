/**
 * Card Emitter Event type
 * 
 * @author Rakshitha
 * @since 4.0.0
 */

enum CardListenerEvent {
     /**
     * Sync when application comes to foreground/anonymous user logins
     * @since 4.0.0
     */
     GENERIC = "GENERIC",

     /**
      * Sync when inbox screen opened.
      * @since 4.0.0
      */
     INBOX_OPEN = "INBOX_OPEN",
 
     /**
      * Sync when SwipeToRefresh widget is pulled.
      * @since 4.0.0
      */
     PULL_TO_REFRESH = "PULL_TO_REFRESH",
}

export default CardListenerEvent;
