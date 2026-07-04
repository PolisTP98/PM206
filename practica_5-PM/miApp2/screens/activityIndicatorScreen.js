import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button, 
    KeyboardAvoidingView, 
    ActivityIndicator, 
    Platform, 
    Image, 
} from "react-native";

export default function ActivityIndicatorScreen() {
    const [nombre, setNombre] = useState("");
    const [carrera, setCarrera] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGuardar = () => {
        if (nombre.trim() === "" || carrera.trim() === "") {
            alert("Favor de llenar todos los campos");
            return;
        }
        
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            alert(`Perfil de ${nombre} guardado con éxito`);
            
            setNombre("");
            setCarrera("");
        }, 3000);
    };

    return (
        <View style = {styles.container}>
            <KeyboardAvoidingView 
                behavior = {Platform.OS === "ios" ? "padding" : "height"} 
                style = {styles.formContainer}
            >
                <View style = {styles.formContainerInner}>
                    <View style = {styles.formBody}>
                        <Text style = {styles.titulo}>Agregar perfil</Text>

                        <TextInput 
                            style = {styles.input} 
                            placeholder = "Nombre completo" 
                            value = {nombre} 
                            onChangeText = {setNombre}
                        />

                        <TextInput 
                            style = {styles.input} 
                            placeholder = "Carrera" 
                            value = {carrera} 
                            onChangeText = {setCarrera}
                        />
                    </View>

                    <View style={styles.actionArea}>
                        {isLoading ? (
                            <ActivityIndicator size = "small" color = "#4D96FF" style = {styles.loader}/>
                        ) : (
                            <Button title = "Guardar perfil" onPress = {handleGuardar} color = "#4D96FF"/>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
            <StatusBar style = "auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#f9f9f9", 
    }, 
    formContainer: {
        flex: 1, 
    }, 
    formContainerInner: {
        flex: 1, 
        padding: 20, 
        justifyContent: "space-between", 
    }, 
    formBody: {
        flex: 1, 
        justifyContent: "center", 
    }, 
    actionArea: {
        paddingTop: 10, 
        paddingBottom: Platform.OS === "ios" ? 20 : 10, 
    }, 
    titulo: {
        fontSize: 22, 
        fontWeight: "bold", 
        marginBottom: 20, 
        textAlign: "center", 
        color: "#333333", 
    }, 
    input: {
        height: 50, 
        borderColor: "#cccccc", 
        borderWidth: 1, 
        borderRadius: 8, 
        marginBottom: 15, 
        paddingHorizontal: 15, 
        backgroundColor: "#ffffff", 
        fontSize: 16, 
    }, 
    loader: {
        marginVertical: 10, 
    }
});