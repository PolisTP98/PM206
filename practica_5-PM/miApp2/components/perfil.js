import { View, StyleSheet, Text } from "react-native";

export const Perfil = () => {
    return(
        <View style={styles.container}>
            <Text>Nombre: Sánchez López Isaac Abdiel</Text>
            <Text>Carrera: Ingeniería en Sistemas Computacionales</Text>
            <Text>Materia: Programación Móvil</Text>
            <Text>Cuatrimestre: 9°</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});