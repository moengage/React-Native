import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, Alert, View, Image } from "react-native";
import { Card, Widget, WidgetType } from "react-native-moengage-cards";
import { CustomHtmlRender } from "./CustomHtmlRender";

export type CardProps = {
    card: Card,
    onCardShown: (shownCard: Card) => void,
    onClick: (clickedCard: Card, widgetId: number) => void,
    onDelete: (deletedCard: Card) => void
}

function getImageWidgetIfAvailable(widgets: Array<Widget>): Widget | null {
    let imageWidget: Widget | null = null
    widgets.forEach((widget) => {
        if (widget.widgetType == WidgetType.IMAGE) imageWidget = widget;
    });

    return imageWidget;
}

function getHeaderWidgetIfAvailable(widgets: Array<Widget>): Widget | null {
    let headerWidget: Widget | null = null
    widgets.forEach((widget) => {
        if (widget.widgetType == WidgetType.TEXT && widget.id == 1) headerWidget = widget;
    });

    return headerWidget;
}

function getMessageWidgetIfAvailable(widgets: Array<Widget>): Widget | null {
    let messageWidget: Widget | null = null
    widgets.forEach((widget) => {
        if (widget.widgetType == WidgetType.TEXT && widget.id == 2) messageWidget = widget;
    });

    return messageWidget;
}

function getCtaWidgetIfAvailable(widgets: Array<Widget>): Widget | null {
    let ctaWidget: Widget | null = null
    widgets.forEach((widget) => {
        if (widget.widgetType == WidgetType.BUTTON) ctaWidget = widget;
    });

    return ctaWidget;
}

const onLongPress = (card: Card, onDelete: (card: Card) => void) => {
    Alert.alert(
        'Delete Card',
        'do you want to delete this card?',
        [
            {
                text: 'no',
            },
            {
                text: 'yes',
                onPress: () => {
                    onDelete(card);
                },
            },
        ],
        { cancelable: true },
    );
};

function getUpdatedTime(timeInMillis: number): string {
    const dateObject = new Date(timeInMillis * 1000);
    return dateObject.toLocaleDateString() + " " + dateObject.toLocaleTimeString();
}

export const BasicCard = (props: CardProps) => {
    const metaData = props.card.metaData;
    const container = props.card.template.containers[0];
    const imageWidget = getImageWidgetIfAvailable(container.widgets);
    const headerWidget = getHeaderWidgetIfAvailable(container.widgets);
    const messageWidget = getMessageWidgetIfAvailable(container.widgets);
    const ctaWidget = getCtaWidgetIfAvailable(container.widgets);

    useEffect(() => {
        props.onCardShown(props.card);
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onLongPress={() => onLongPress(props.card, props.onDelete)}
            onPress={() => {
                console.log("Card Clicked", props.card);
                props.onClick(props.card, -1);
            }}
            style={[styles.card, { backgroundColor: container.style?.backgroundColor ?? "#FFFFFF" }]}
        >
            <TouchableOpacity
                onLongPress={() => onLongPress(props.card, props.onDelete)}
                onPress={() => {
                    console.log("Image Clicked", imageWidget);
                    props.onClick(props.card, imageWidget?.id ?? -1);
                }}
            >
                <View>
                    {imageWidget != null && <Image style={styles.imageContainer} source={{ uri: imageWidget.content }} />}
                    {metaData.isPinned && <Image style={styles.pinnedImage} source={require('../../../assets/images/moe_card_pin.png')} />}
                </View>
            </TouchableOpacity>
            <View style={styles.textSection}>
                {headerWidget != null && (
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Header Clicked", headerWidget);
                            props.onClick(props.card, headerWidget?.id ?? -1);
                        }}
                        onLongPress={() => onLongPress(props.card, props.onDelete)}
                    >
                        <CustomHtmlRender content={headerWidget.content} />
                    </TouchableOpacity>
                )}
                {messageWidget != null && (
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Message Clicked", messageWidget);
                            props.onClick(props.card, messageWidget?.id ?? -1);
                        }}
                        onLongPress={() => onLongPress(props.card, props.onDelete)}
                    >
                        <CustomHtmlRender content={messageWidget.content} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.metaSection}>
                {metaData.updatedTime != -1 && <Text style={styles.metaSectionText}>{getUpdatedTime(metaData.updatedTime)}</Text>}
                <Text style={[styles.metaSectionText, { textAlign: 'right' }]}>{container.templateType} Template</Text>
                {metaData.campaignState.isClicked && <Image style={styles.clickedImage} source={require('../../../assets/images/moe_card_clicked.png')} />}
            </View>
            <View>
                {ctaWidget != null && (
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Cta Clicked", ctaWidget);
                            props.onClick(props.card, ctaWidget?.id ?? -1);
                        }}
                        onLongPress={() => onLongPress(props.card, props.onDelete)}
                        activeOpacity={0.9}
                        style={styles.ctaSection}
                    >
                        <CustomHtmlRender content={ctaWidget.content} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 8,
        borderRadius: 8
    },
    imageContainer: {
        width: '100%',
        height: 128,
        resizeMode: 'cover',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    pinnedImage: {
        width: 12,
        height: 12,
        margin: 8,
        flex: 1,
        position: 'absolute',
        right: 0,
    },
    clickedImage: {
        width: 16,
        height: 16,
        marginHorizontal: 8
    },
    metaSection: {
        flexDirection: 'row',
        paddingHorizontal: 4
    },
    metaSectionText: {
        flex: 1,
        color: '#a6a6a6',
        fontSize: 12,
        paddingHorizontal: 8
    },
    textSection: {
        paddingHorizontal: 4
    },
    text: {
        paddingVertical: 8,
        paddingHorizontal: 4
    },
    ctaSection: {
        height: 40,
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a3a3c2',
        paddingVertical: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    }
});