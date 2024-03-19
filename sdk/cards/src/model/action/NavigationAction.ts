import ActionType from "../enums/ActionType";
import NavigationType from "../enums/NavigationType";
import Action from "./Action";

/**
 * Navigation Action object.
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class NavigationAction extends Action {

    /**
     * Type of Navigation action.
     * @since 1.0.0
     */
    navigationType: NavigationType;

    /**
     * Url/Screen-name to which the user should be navigated.
     * @since 1.0.0
     */
    value: string;

    /**
     * Key-Value pair added on the MoEngage Platform for navigation action.
     * @since 1.0.0
     */
    kvPairs: { [k: string]: any };

    constructor(actionType: ActionType, navigationType: NavigationType, value: string, kvPairs: { [k: string]: any }) {
        super(actionType);
        this.navigationType = navigationType;
        this.value = value;
        this.kvPairs = kvPairs;
    }
}

export default NavigationAction;