/* Zona 1: Importaciones de componentes y archivos */
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/* Zona 2: Main - Hogar de los componentes */
export default function FlatListScreen() {
    return (
        <View style = {styles.container}>
            <StatusBar style = "auto"/>
            <Text>Aquí va la práctica de Saul</Text>
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
});