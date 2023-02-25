import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    // TextInput
} from "react-native"

import {
    Card,
    IconButton,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';


interface MarkerImagesCardProps {
    // latitude: string,
    // longitude: string,
    // what3words: string | undefined,
    // onLatLngChange: (lat: string, lng: string) => void
}
const MarkerImagesCard: React.FC<MarkerImagesCardProps> = ({ }) => {
    const theme = useTheme();

    return (
        <Card
            mode='elevated'
            style={styles.inputContainerStyle}
            onPress={() => { }}
        >
            <Card.Title
                title="Images"
                titleVariant='titleMedium'  
                titleStyle={styles.title}
                left={(props) => <IconButton size={props.size - 5} icon="image-multiple" />}
            />
            {/* <Card.Content>

            </Card.Content> */}
        </Card>

    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        flex: 1,
    },
    title: {
        fontSize: 25,
        top: 7
    },
    textInput: {
        width: '90%',
        fontSize: 22
    },
    text: {
        fontSize: 20,
        margin: 10
    }
});

export default MarkerImagesCard;