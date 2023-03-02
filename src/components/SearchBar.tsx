import { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableOpacity
} from "react-native"

import {
    TextInput,
    Text,
    useTheme
} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

import Animated,{ StretchInX, StretchInY, StretchOutX, StretchOutY } from 'react-native-reanimated';


interface SearchBarProps {
    onSubmitEditing: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSubmitEditing }) => {
    const theme = useTheme();
    const timerRef = useRef<NodeJS.Timeout>();

    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [searchBarText, setSearchBarText] = useState("")

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, [])

    useEffect(()=>{
        if(searchBarVisible){
            setSearchBarText('');
            searchBarTextInputTimeout(20);
        }
    },[searchBarVisible])

    async function searchBarTextInputTimeout(timeoutInSeconds: number) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => { setSearchBarVisible(false); }, timeoutInSeconds * 1000)
    }

    function logoAndButton() {
        return (
            <Animated.View entering={StretchInX}>
                <TouchableOpacity
                    onPress={() => {
                        setSearchBarVisible(true);
                    }}
                    style={
                        {
                            backgroundColor: theme.colors.secondaryContainer,
                            borderColor: theme.colors.primary,
                            ...styles.logoAndButton
                        }}
                >
                    <View style={styles.logoContainer}>
                        <Icons name='umbrella-beach' size={28} color={theme.colors.onPrimaryContainer} />
                        <Text style={{ color: theme.colors.onPrimaryContainer, ...styles.logoText }} >
                            UmbrellaPeat
                        </Text>

                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    function textInput() {
        return (
            <Animated.View entering={StretchInX}>
                <TextInput
                    mode='outlined'
                    theme={{ roundness: 25 }}
                    style={{ backgroundColor: theme.colors.secondaryContainer, ...styles.textInput }}
                    onChangeText={(text: string) => { searchBarTextInputTimeout(30); setSearchBarText(text); }}
                    onSubmitEditing={() => {searchBarTextInputTimeout(50);onSubmitEditing(searchBarText); }}
                    autoFocus={true}
                    autoComplete='username'
                />
            </Animated.View>
        );
    }


    return (
        <View style={styles.searchBarContainer}>
            {
                searchBarVisible
                    ? textInput()
                    : logoAndButton()
            }
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 30,
    },
    logoAndButton: {
        borderRadius: 25,
        borderWidth: 1,
        height: 50,
        marginTop: 5,
        marginHorizontal:30
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 25,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 2
    },
    textInput: {
        fontSize: 22,
        fontWeight:'bold',
    }
});

export default SearchBar;