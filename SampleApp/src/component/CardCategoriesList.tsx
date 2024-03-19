import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";

type CardCategoriesProps = {
    categories: Array<string>,
    onClick: (clickedCategory) => void
}

export const CardsCategoriesList = (props: CardCategoriesProps) => {

    const [activeTab, updateActiveTab] = useState<number>(0);

    return (
        <View style={style.tab}>
            <FlatList
                horizontal={true}
                data={props.categories}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={[style.chip, { backgroundColor: activeTab == index ? '#088A85' : '#808080' }]}
                            onPress={() => {
                                updateActiveTab(index)
                                props.onClick(item)
                            }}>
                            <View>
                                <Text style={style.chipText}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item) => item}
            />
        </View>
    );
};

const style = StyleSheet.create({
    tab: {
        paddingVertical: 8
    },

    chip: {
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 4,
    },

    chipText: {
        color: '#FFFFFF'
    }
});