/**
 * DisplayRules for Campaign
 */
export default class MoEInAppRules {
    /**
     * Screenname for which InApp was configured to be shown.
     */
    screenName: string

    /**
     *  contexts for which InApp was configured to be shown.
     */
    contexts: Array<string>

    constructor(screenName: string, contexts: Array<string> = []) {
        this.screenName = screenName;
        this.contexts = contexts;
    }
}