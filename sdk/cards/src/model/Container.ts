import Widget from "./Widget";
import Action from "./action/Action";
import TemplateType from "./enums/TemplateType";
import ContainerStyle from "./styles/ContainerStyle";

/**
 * Container to hold UI widget
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class Container {

    /**
     * Unique identifier for a template
     * @since 1.0.0
     */
    id: number;

    /**
     * Type of container.
     * @since 1.0.0
     */
    templateType: TemplateType;

    /**
     * Style associated to the Container
     * @since 1.0.0
     */
    style: ContainerStyle | undefined;

    /**
     * Widget list associated to the Container
     * @since 1.0.0
     */
    widgets: Array<Widget>;

    /**
     * Actions to be performed on widget click
     * @since 1.0.0
     */
    actionList: Array<Action>;

    constructor(
        id: number,
        templateType: TemplateType,
        style: ContainerStyle | undefined,
        widgets: Array<Widget>,
        actionList: Array<Action>
    ) {
        this.id = id;
        this.templateType = templateType;
        this.style = style;
        this.widgets = widgets;
        this.actionList = actionList;
    }
}

export default Container;