/**
 * DisplayRules for Campaign
 * @since 11.1.0
 */
export default class MoEInAppRules {
    /**
     * Screenname for which InApp was configured to be shown.
     */
    screenName: string | null

    /**
     *  contexts for which InApp was configured to be shown.
     */
    contexts: Array<string>

    constructor(screenName: string | null, contexts: Array<string> = []) {
        this.screenName = screenName;
        this.contexts = contexts;
    }
}