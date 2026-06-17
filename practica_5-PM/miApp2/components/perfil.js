/* Perfil usando destructuración */
import { View, Text, Button, StyleSheet } from 'react-native';
import React,{useState} from 'react';

export const Perfil = ({ nombre, carrera, materia, cuatrimestre, estiloExterno }) => {

    const [mostrar, setMostrar] = useState(false);

    return(
        <View style = {[styles.tarjeta, estiloExterno]}>
            <Text style = {styles.nombre}>{nombre}</Text>
        {mostrar && 
        <>
            <Text style = {styles.carrera}>Carrera: {carrera}</Text>
            <Text style = {styles.otroTexto}>Materia: {materia}</Text>
            <Text style = {styles.otroTexto}>Cuatrimestre: {cuatrimestre}</Text>
        </>
        }

        <Button title= "Mostrar perfil"
        onPress={() => setMostrar(!mostrar)}
        />

        </View>
    );
}

const styles = StyleSheet.create({
    nombre: {
        fontSize: 24,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    carrera: {
        fontSize: 18,
        color: 'blue',
        fontFamily: 'Roboto',
    },
    otroTexto: {
        fontSize: 12,
        fontFamily: 'Courier',
        fontStyle: 'italic',
    },
    tarjeta: {
        borderWidth: 4,
        margin: 20,
        padding: 25,
    }
});

/* 
Perfil usando Props

import { View, Text } from 'react-native';

export const Perfil = (props) => {
    return (
        <View>
            <Text>{props.nombre}</Text>
            <Text>{props.carrera}</Text>
            <Text>{props.materia}</Text>
            <Text>{props.cuatrimestre}</Text>
        </View>
    );
}
*/