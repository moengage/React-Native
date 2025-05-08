/**
 * DisplayRules for Campaign
 * @since 11.1.0
 */
export default class MoEInAppRules {
    /**
     * Screennames for which InApp was configured to be shown.
     */
    screenNames: Array<string>

    /**
     *  contexts for which InApp was configured to be shown.
     */
    contexts: Array<string>;

    /**
     * Screennames for which InApp was configured to be shown.
     */
    screenNames: Array<string>;

    constructor(screenName: string | null, contexts: Array<string> = [], screenNames: Array<string> = []) {
        this.screenName = screenName;
        this.contexts = contexts;
        this.screenNames = screenNames;
    }
}