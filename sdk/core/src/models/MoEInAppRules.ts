/**
 * DisplayRules for Campaign
 * @since 11.1.0
 */
export default class MoEInAppRules {
    /**
    * Screenname for which InApp was configured to be shown.
    * @deprecated Use the 'screenNames' property instead.
    */
    screenName: string | null;

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