import { useState, useEffect } from 'react';
import {
    StyleSheet,
    View
} from "react-native"

import {
    Button,
    useTheme,
} from 'react-native-paper';


interface NavigateAndDeleteButtonsProps {
    onDeleteButtonPressed:()=>void,
}
const NavigateAndDeleteButtons: React.FC<NavigateAndDeleteButtonsProps> = ({onDeleteButtonPressed }) => {
    const theme = useTheme();


    return (
        <View style={styles.inputContainerStyle}>
            <View style={styles.buttonContainer}>
                <Button
                    icon="navigation-variant"
                    mode="elevated"
                    onPress={()=>{}}
                    style={styles.button}
                    labelStyle={styles.fontStyle}
                >
                    Navigate
                </Button>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    icon="delete"
                    mode="elevated"
                    buttonColor={theme.colors.error}
                    onPress={onDeleteButtonPressed}
                    style={styles.button}
                    labelStyle={{color: theme.colors.onPrimary,...styles.fontStyle}}
                >
                    Delete
                </Button>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        margin: 10,
        height: 50,

        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        // marginHorizontal: 10,
        maxWidth:'48%',
    },
    button: {
        flex: 1,
    },
    fontStyle: {
        fontSize: 22,
        lineHeight: 30,
        margin: 5
    }
});

export default NavigateAndDeleteButtons;