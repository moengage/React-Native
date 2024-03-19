import React from "react";
import { useWindowDimensions } from "react-native";
import HTML, {
    HTMLContentModel,
    HTMLElementModel,
} from 'react-native-render-html';

const fontElementModel = HTMLElementModel.fromCustomModel({
    tagName: 'font',
    contentModel: HTMLContentModel.mixed,
    getUADerivedStyleFromAttributes({ face, color, size }) {
        let style = {};
        if (face) {
            style.fontFamily = face;
        }
        if (color) {
            style.color = color;
        }
        return style;
    },
});

const customHTMLElementModels = { font: fontElementModel };

export const CustomHtmlRender = (props) => {
    const { width } = useWindowDimensions();

    return (
        <HTML contentWidth={width} source={{ html: props.content }} customHTMLElementModels={customHTMLElementModels} />
    );
}