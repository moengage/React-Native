/**
 * Condition/Situation when sync
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
enum SyncType {

    /**
     * Sync when application comes to foreground.
     * @since 1.0.0
     */
    APP_OPEN = "APP_OPEN",

    /**
     * Sync when inbox screen opened.
     * @since 1.0.0
     */
    INBOX_OPEN = "INBOX_OPEN",

    /**
     * Sync when SwipeToRefresh widget is pulled.
     * @since 1.0.0
     */
    PULL_TO_REFRESH = "PULL_TO_REFRESH",

    /**
     * Sync when User logins .
     * @since 4.0.0
     */
    IMMEDIATE = "IMMEDIATE"
}

export default SyncType;