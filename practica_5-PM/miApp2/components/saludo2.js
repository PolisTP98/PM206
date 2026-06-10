import { StyleSheet, Button, Text, Image, View } from "react-native";

export const Saludo2 = () => {
    return(
        <View style={styles.container}>
            <Text>Soy un componente propio</Text>
            <Image source={require('../assets/wave.png')}/>
            <Button title="¡Adiós S206!"></Button>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});