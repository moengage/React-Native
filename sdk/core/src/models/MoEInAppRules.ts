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
    contexts: Array<string>

    constructor(screenNames: Array<string> = [], contexts: Array<string> = []) {
        this.screenNames = screenNames;
        this.contexts = contexts;
    }
    
}