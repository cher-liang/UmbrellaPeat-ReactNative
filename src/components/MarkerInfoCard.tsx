import { useState, useEffect } from 'react';
import {
    StyleSheet,
} from "react-native"

import {
    Card,
    IconButton,
    useTheme
} from 'react-native-paper';


interface MarkerInfoCardProps {
    deviceId: string,
    timestamp: Date,
    edited_timestamp ?: Date,
}
const MarkerInfoCard: React.FC<MarkerInfoCardProps> = ({ deviceId,timestamp,edited_timestamp}) => {
    const theme = useTheme();

    function getSubtitle(){
        return timestamp.toLocaleString() + ((edited_timestamp)?(`\t(Edited: ${edited_timestamp.toLocaleString()})`):'');
    }

    return (
        <Card
            mode='elevated'
            onPress={() => { }}
        >
            <Card.Title
                title={deviceId}
                titleVariant='titleMedium'  
                titleStyle={styles.title}
                left={(props) => <IconButton size={props.size - 5} icon="view-agenda" />}
                right={(props) => <IconButton size={props.size} icon="pencil-outline" />}
                subtitle={getSubtitle()}
            />
        </Card>

    );
}

const styles = StyleSheet.create({
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
    },
});

export default MarkerInfoCard;