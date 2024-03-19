/**
 * Types of navigation action.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
enum NavigationType {

    /**
     * Navigation is done using a deep-link Url or http(s) url.
     * @since 1.0.0
     */
    DEEPLINK = "DEEPLINK",

    /**
     * Navigation to a rich-landing url
     * @since 1.0.0
     */
    RICHLANDING = "RICHLANDING",

    /**
     * Navigation is done using activity name or screen name.
     * @since 1.0.0
     */
    SCREENNAME = "SCREENNAME"
}

export default NavigationType;
