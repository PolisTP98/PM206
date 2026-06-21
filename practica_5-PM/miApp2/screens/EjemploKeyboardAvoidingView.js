import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';

export default function EjemploKeyboard() {
    const [textoActual, setTextoActual] = useState('');
    const [mensajes, setMensajes] = useState(['¡Hola!', 'Mundo']);

    const enviarMensaje = () => {
        if(textoActual.trim() === '') return;

        setMensajes([...mensajes, textoActual]);
        setTextoActual('');
    };

    return(
        <KeyboardAvoidingView
            style = {styles.container}
            behavior = {Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset = {20}
        >
            <ScrollView style = {styles.chatArea}>
                {mensajes.map((msg, index) => (
                    <Text key = {index} style = {styles.burbuja}>{msg}</Text>
                ))}
            </ScrollView>

            <View style = {styles.inputArea}>
                <TextInput
                    style = {styles.input}
                    placeholder = "Escribe un mensaje..."
                    value = {textoActual}
                    onChangeText = {setTextoActual}
                />
                <Button title = "Enviar" onPress = {enviarMensaje}/>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
    },
    chatArea: {
        flex: 1,
        padding: 20,
        marginTop: 40,
    },
    burbuja: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    inputArea: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#CCCCCC',
        paddingBottom: 40,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#101010',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        height: 40,
    },
});