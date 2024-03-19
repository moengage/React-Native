import WidgetStyle from "./WidgetStyle";

/**
 * Style attributes for a Button Widget.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class ButtonStyle extends WidgetStyle {

    /**
     * Font size of the button text.
     * @since 1.0.0
     */
    fontSize: number;

    constructor(backgroundColor: string, fontSize: number) {
        super(backgroundColor);
        this.fontSize = fontSize;
    }
}

export default ButtonStyle;