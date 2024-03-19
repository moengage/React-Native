/**
 * Base style for all widgets.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
abstract class WidgetStyle {

    /**
     * Background color of the Button.
     */
    backgroundColor: string;

    constructor(backgroundColor: string) {
        this.backgroundColor = backgroundColor;
    }
}

export default WidgetStyle;