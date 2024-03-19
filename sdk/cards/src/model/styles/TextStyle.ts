import WidgetStyle from "./WidgetStyle";

/**
 * Style attributes for the Text widget.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class TextStyle extends WidgetStyle {

    fontSize: number;

    constructor(backgroundColor: string, fontSize: number) {
        super(backgroundColor);
        this.fontSize = fontSize;
    }
}

export default TextStyle;