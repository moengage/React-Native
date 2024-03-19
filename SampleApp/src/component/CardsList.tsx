import React from "react";
import { View, FlatList } from "react-native";
import { Card } from "react-native-moengage-cards";
import { BasicCard } from "./BasicCard";

type CardsProps = {
    cards: Array<Card>,
    onCardShown: (shownCard: Card) => void,
    onClick: (clickedCard: Card, widgetId: number) => void,
    onDelete: (deletedCard: Card) => void
}

export const CardsList = (props: CardsProps) => {
    return (
        <View style={{ backgroundColor: '#f0f0f5', flex: 1 }}>
            <FlatList
                data={props.cards}
                renderItem={({ item }) => {
                    // Illustration Cards UI using same ui as basic card with type displayed on cards
                    return (
                        <BasicCard card={item}
                            onCardShown={props.onCardShown}
                            onClick={props.onClick}
                            onDelete={props.onDelete} />
                    );
                }}
                keyExtractor={(item) => item.cardId}
            />
        </View>
    );
};