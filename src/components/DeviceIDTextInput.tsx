import { View, StyleSheet } from "react-native"

import { TextInput,HelperText, useTheme } from "react-native-paper";

interface DeviceIDTextInputProps {
    onChangeText: (text: string) => void;
    onClearText: ()=>void;
    deviceId: string;
    errorType: 'must unique' | 'empty' | '';
}

const DeviceIDTextInput: React.FC<DeviceIDTextInputProps> = ({ onChangeText,onClearText,deviceId,errorType }) => {
    const theme= useTheme();

    function renderXIcon() {
        if (errorType!=='') {
            return <TextInput.Icon icon="close-circle-outline" color={theme.colors.error} onPress={onClearText} />
        } else {
            return null
        }
    }

    return (
        <View style={styles.inputContainerStyle}>
            <TextInput
                label="Device ID"
                placeholder="Enter unique device id"
                value={deviceId}
                onChangeText={onChangeText}
                right={renderXIcon()}
                error={errorType!==''}

                mode='outlined'
                theme={{
                    roundness:25
                }}
                style={styles.textInput}
            />
            <HelperText type="error" visible={errorType!==''}>
                {
                    (errorType=='must unique') ?"Device ID must be unique" : "Device ID cannot be empty"
                }
            </HelperText>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        // flex:1,
        // backgroundColor:'yellow',
        // marginHorizontal: 10,
    },
    textInput:{
        fontSize:22
    }
});

export default DeviceIDTextInput;