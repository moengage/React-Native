import ActionType from "../enums/ActionType";

/**
 * Base class for actions.
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
abstract class Action {

    /**
     * Action type
     * @since 1.0.0
     */
    actionType: ActionType;

    constructor(actionType: ActionType) {
        this.actionType = actionType;
    }
}

export default Action;