/* Zona 1: Importaciones de componentes y archivos */
import React, { useState } from "react";
import { View, Button, TextInput, Platform, Alert, Keyboard, StyleSheet } from "react-native";

/* Zona 2: Main - Hogar de los componentes */
export default function TextInputScreen() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [edad, setEdad] = useState('');
    const [correo, setCorreo] = useState('');

    const procesarRegistro = () => {
        if(Platform.OS !== "web") Keyboard.dismiss();
        if(!nombre || !password || !edad || !correo) {
            alertasManager("Validación", "Todos los campos son obligatorios");
            return;
        }
        alertasManager("Éxito", 'Registro procesado para: ${nombre}');
    };

    const alertasManager = (titulo, mensaje) => {
        if(Platform.OS === "web") {
            alert("${titulo}: ${mensaje}");
        }
        else {
            Alert.alert(titulo, mensaje);
        }
    };

    return (
        <View style = {styles.container}>
            {}
            <TextInput
                style = {styles.input} 
                placeholder = "Nombre completo" 
                value = {nombre} 
                onChangeText = {setNombre}
            />

            {}
            <TextInput
                style = {styles.input}
                placeholder = "Contraseña" 
                value = {password} 
                onChangeText = {setPassword} 
                secureTextEntry = {true}
            />

            {}
            <TextInput
                style = {styles.input} 
                placeholder = "Edad" 
                value = {edad} 
                onChangeText = {setEdad} 
                keyboardType = "numeric" 
                maxLength = {5}
            />

            {}
            <TextInput
                style = {styles.input} 
                placeholder = "Correo electrónico" 
                value = {correo} 
                onChangeText = {setCorreo} 
                keyboardType = "email-address" 
                autoCapitalize = "none" 
                autoCorrect = {false}
                maxLength = {255}
            />

            {}
            <Button
                title = "Registrar usuario" 
                onPress = {procesarRegistro}
            />
        </View>
    );
}

/* Zona 3: Estilos y posicionamiento */
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent:'center', 
        padding: 20, 
        backgroundColor: '#f5f6fa' 
    }, 
    input: { 
        borderWidth: 1, 
        borderColor: '#dcdde1', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12, 
        backgroundColor: '#fff' 
    }
});