/* Zona 1: Importaciones */
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';

/* Zona 2: Componente */
export default function SafeAreaScreen() {

  const [usarSafeArea, setUsarSafeArea] = useState(true);

  const Contenedor = usarSafeArea ? SafeAreaView : View;

  return (
    <Contenedor style={[styles.fondo, !usarSafeArea && { paddingTop: 0 }]}>

      <Text style={styles.titulo}>SafeAreaView y ScrollView</Text>

      <Text style={styles.descripcion}>
        SafeAreaView evita que el contenido se encime con zonas del teléfono como el notch o la barra superior.
      </Text>

      <Text style={styles.estado}>
        Estado actual: {usarSafeArea ? 'Usando SafeAreaView' : 'Usando View normal'}
      </Text>

      <View style={styles.boton}>
        <Button
          title={usarSafeArea ? 'Cambiar a View normal' : 'Cambiar a SafeAreaView'}
          onPress={() => setUsarSafeArea(!usarSafeArea)}
          color="#4e73df"
        />
      </View>

      <Text style={styles.descripcion}>
        ScrollView permite desplazarse cuando hay más contenido del que cabe en pantalla.
      </Text>

      <ScrollView style={styles.lista} contentContainerStyle={styles.contenidoScroll}>
        <View style={[styles.tarjeta, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.textoTarjeta}>Elemento 1</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#3498db' }]}>
          <Text style={styles.textoTarjeta}>Elemento 2</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.textoTarjeta}>Elemento 3</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#f39c12' }]}>
          <Text style={styles.textoTarjeta}>Elemento 4</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#9b59b6' }]}>
          <Text style={styles.textoTarjeta}>Elemento 5</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#1abc9c' }]}>
          <Text style={styles.textoTarjeta}>Elemento 6</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#727272' }]}>
          <Text style={styles.textoTarjeta}>Elemento 7</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#ff6b6b' }]}>
          <Text style={styles.textoTarjeta}>Elemento 8</Text>
        </View>
      </ScrollView>

    </Contenedor>
  );
}

/* Zona 3: Estilos */
const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
  },
  descripcion: {
    fontSize: 13,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 12,
  },
  estado: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  boton: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  lista: {
    flex: 1,
  },
  contenidoScroll: {
    paddingBottom: 20,
  },
  tarjeta: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoTarjeta: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});