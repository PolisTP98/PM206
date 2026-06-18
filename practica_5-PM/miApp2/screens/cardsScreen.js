/* Zona 1: Importaciones de componentes y archivos */
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import {Saludo} from '../components/saludo';
import {Saludo2} from '../components/saludo2';
import {Perfil} from '../components/perfil';

/* Zona 2: Main - Hogar de los componentes */
export default function CardsScreen() {
    return (
        <View style = {styles.container}>
            <Perfil 
                nombre = "Sánchez López Isaac Abdiel" 
                carrera = "Ingenieria en Sistemas Computacionales" 
                apodo = "GOAT" 
                materia = "Programacion Móvil" 
                cuatrimestre = "9°"
                estiloExterno = {styles.tarjetaRoja}
            />
            <Perfil 
                nombre = "Daniela Lisset Elizalde Ortiz" 
                carrera = "Ingenieria en Sistemas Computacionales" 
                apodo = "Mi vieja w" 
                materia = "Programación Móvil" 
                cuatrimestre = "9°"
                estiloExterno = {styles.tarjetaVerde}
            />
            <Perfil 
                nombre = "Rodríguez Ruiz Ian David" 
                carrera = "Ingenieria en Sistemas Computacionales" 
                apodo = "Gay" 
                materia = "Programacion Móvil" 
                cuatrimestre = "9°"
                estiloExterno = {styles.tarjetaRoja}
            />
        </View>
    );
}

/* Zona 3: Estilos y posicionamiento */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
    },
    tarjetaRoja: {
        backgroundColor: '#FF6B6B',
    },
    tarjetaVerde: {
        backgroundColor: '#6BCB77'
    }
});