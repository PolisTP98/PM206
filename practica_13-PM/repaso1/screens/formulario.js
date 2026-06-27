// IMPORTAR LOS MÓDULOS NECESARIOS
import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { 
    Platform, 
    Alert, 
    Keyboard, 
    KeyboardAvoidingView, 
    ScrollView, 
    TouchableWithoutFeedback, 
    View, 
    TextInput, 
    Text, 
    Switch, 
    Button, 
    StyleSheet, 
} from "react-native";

// FUNCIÓN PRINCIPAL DE LA SCREEN
export default function RepasoScreen() {
    // DECLARACIÓN DE VARIABLES PARA EL FORMULARIO (TextInput)
    const[nombreCompleto, setNombreCompleto] = useState("");
    const[carrera, setCarrera] = useState("");
    const[semestre, setSemestre] = useState("");

    // DECLARACIÓN DE VARIABLES PARA EL FORMULARIO (Switch)
    const[taller, setTaller] = useState(false);
    const[constancia, setConstancia] = useState(false);
    const[deporte, setDeporte] = useState(false);

    // FUNCIÓN PARA LANZAR ALERTAS EN EL TELÉFONO/ORDENADOR CON UN TÍTULO Y MENSAJE
    const lanzarAlertas = (titulo, mensaje) => {
        if(Platform.OS === "web") {
            alert(`${titulo}: ${mensaje}`);
            return;
        }
        Alert.alert(titulo, mensaje);
    };

    // FUNCIÓN PARA VALIDAR QUE LOS CAMPOS DE TEXTO DE ENTRADA NO ESTÉN VACÍOS (ENTRE OTRAS COSAS) ANTES DE GUARDAR EL REGISTRO
    const validarRegistro = () => {
        if(Platform.OS !== "web") Keyboard.dismiss();
        if(!nombreCompleto || !carrera || !semestre) {
            lanzarAlertas("Campos incompletos", "Debes llenar todos los campos del formulario");
            return;
        }

        // VARIABLE PARA CONVERTIR EL STRING INGRESADO EN EL CAMPO DE TEXTO DE ENTRADA "semestre" A UN NÚMERO ENTERO BASE 10
        const numeroSemestre = parseInt(semestre, 10);

        if(Number.isInteger(numeroSemestre) && (numeroSemestre >= 1 && numeroSemestre <= 10)) {
            lanzarAlertas(
                "Éxito", 
                `
Registro enviado

Nombre completo: ${nombreCompleto}
Carrera: ${carrera}
Semestre: ${numeroSemestre}

Taller: ${taller ? "Sí" : "No"}
Constancia: ${constancia ? "Sí" : "No"}
Deportes: ${deporte ? "Sí" : "No"}
                `
            );
        }
        else {
            lanzarAlertas("Error", "El semestre debe ser un número entero entre 1 y 10");
        }
    };

    // RETORNO DE LOS COMPONENTES DE LA SCREEN
    return (
        <KeyboardAvoidingView 
            style = {styles.container} 
            behavior = {Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style = "auto"/>

            <ScrollView>
                <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                    <View>
                        <View style = {[styles.titleContainer, styles.spacing]}>
                            <Text style = {[styles.text, styles.title]}>Registro de evento Universitario</Text>
                        </View>

                        {}
                        <TextInput 
                            style = {[styles.input, styles.text]} 
                            placeholder = "Nombre completo" 
                            value = {nombreCompleto} 
                            onChangeText = {setNombreCompleto} 
                            maxLength = {255}
                        />

                        {}
                        <TextInput 
                            style = {[styles.input, styles.text]} 
                            placeholder = "Carrera" 
                            value = {carrera} 
                            onChangeText = {setCarrera} 
                            maxLength = {100}
                        />

                        {}
                        <TextInput 
                            style = {[styles.input, styles.text]} 
                            placeholder = "Semestre" 
                            value = {semestre} 
                            onChangeText = {setSemestre} 
                            keyboardType = "number-pad" 
                            maxLength = {2}
                        />

                        <Text style = {[styles.text, styles.subtitle, styles.spacing]}>Opciones</Text>

                        <View style = {styles.containerRow}>
                            <Text style = {styles.text}>¿Asistirá al taller?</Text>
                            <Switch 
                                value = {taller} 
                                onValueChange = {setTaller} 
                                trackColor = {{false: "#d3d3d3", true: "lightblue"}} 
                                thumbColor = "#fff"
                            />
                        </View>

                        <View style = {styles.containerRow}>
                            <Text style = {styles.text}>¿Requiere constancia?</Text>
                            <Switch 
                                value = {constancia} 
                                onValueChange = {setConstancia} 
                                trackColor = {{false: "#d3d3d3", true: "lightblue"}} 
                                thumbColor = "#fff"
                            />
                        </View>

                        <View style = {[styles.containerRow, styles.spacing]}>
                            <Text style = {styles.text}>¿Participará en actividades deportivas?</Text>
                            <Switch 
                                value = {deporte} 
                                onValueChange = {setDeporte} 
                                trackColor = {{false: "#d3d3d3", true: "lightblue"}} 
                                thumbColor = "#fff"
                            />
                        </View>

                        <Button 
                            title = "Enviar registro" 
                            onPress = {validarRegistro}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// FUNCIÓN PARA ESTABLECER LOS ESTILOS DE LA SCREEN
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingTop: 60, 
        paddingBottom: 60, 
        paddingLeft: 20, 
        paddingRight: 20, 
        backgroundColor: "#fff", 
    }, 
    containerRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
    }, 
    input: { 
        borderWidth: 1.5, 
        borderColor: "#d3d3d3", 
        padding: 15, 
        borderRadius: 15, 
        marginBottom: 15, 
        backgroundColor: "#fff", 
    }, 
    titleContainer: { 
        alignItems: "center", 
    }, 
    title: { 
        fontSize: 20, 
        fontWeight: "bold", 
    }, 
    subtitle: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginTop: 30, 
    }, 
    text: { 
        fontSize: 14, 
        fontFamily: "Arial", 
    }, 
    spacing: { 
        marginBottom: 30, 
    }, 
});