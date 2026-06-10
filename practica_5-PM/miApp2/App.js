/* Zona1: Importaciones de componentes y archivos */
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Saludo } from './components/saludo';
import { Saludo2 } from './components/saludo2';
import { Perfil } from './components/perfil';

/* Zona2: Main - Hogar de los componentes */
export default function App() {
  return (
    <View style={styles.container}>
      <Text>------------ Componente nativo -------------</Text>
      <Image source={require('./assets/wave.png')}/>
      <Text>¡Hola mundo React Native!</Text>
      <Text>------------ Componente simple -------------</Text>
      <Saludo></Saludo>
      <Text>------------ Componente compuesto -------------</Text>
      <Saludo2></Saludo2>
      <Text>------------ Práctica del reporte -------------</Text>
      <Perfil></Perfil>
      <StatusBar style="auto" />
    </View>
  );
}

/* Zona3: Estilos y posicionamiento */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});