import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';

export default function DetalleUsuariosScreen() {
  const API_URL = 
    Platform.OS === "web" 
      ? "http://localhost:5000/v1/"
      : process.env.EXPO_PUBLIC_API_URL;
  const AUTH_HEADER = 'Basic YWRtaW46MTIzNA==';
  const params = useLocalSearchParams();
  const router = useRouter();

  const id = params?.id ? String(params.id) : '';
  const nombre = params?.nombre ? String(params.nombre) : 'Usuario';
  const edad = params?.edad ? String(params.edad) : '';

  const [modalVisible, setModalVisible] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const mostrarMensaje = (titulo, mensaje, callback) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
      if (callback) callback();
    } else {
      Alert.alert(titulo, mensaje, [
        { text: 'OK', onPress: callback },
      ]);
    }
  };

  const confirmarEliminacion = async () => {
    if (!id) {
      mostrarMensaje('Error', 'ID de usuario no encontrado.');
      return;
    }

    try {
      setEliminando(true);
      const respuesta = await fetch(`${API_URL}usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_HEADER,
        },
      });
      const textoRespuesta = await respuesta.text();
      console.log(`Respuesta del servidor:\n${textoRespuesta}`);
      if(respuesta.ok) {
        const datos = JSON.parse(textoRespuesta);
        console.log(`Respuesta de la API:\n${datos}`);
      }
      else {
        console.error(`Error del servidor (${respuesta.status}): ${textoRespuesta}`);
      }
      setModalVisible(false);
      mostrarMensaje('Éxito', 'Usuario eliminado correctamente.', () => {
        router.replace('/(tabs)/consulta');
      });
    } catch (error) {
      console.log('Error al eliminar usuario:', error);
      mostrarMensaje('Error', 'No fue posible eliminar el usuario.');
    } finally {
      setEliminando(false);
    }
  };

  const irAEditar = () => {
    router.push({
      pathname: '/editar',
      params: {
        id: String(id),
        nombre: String(nombre),
        edad: String(edad),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>

          <Text style={styles.titulo}>
            Detalles del Usuario
          </Text>

          <Text style={styles.nombre}>
            {nombre}
          </Text>

          <View style={styles.linea}></View>

          <Text style={styles.info}>
            ID: #{id}
          </Text>

          <Text style={styles.info}>
            Edad: {edad} años
          </Text>

          <Pressable
            style={styles.botonEditar}
            onPress={irAEditar}
          >
            <Text style={styles.textoBoton}>Editar Usuario</Text>
          </Pressable>

          <Pressable
            style={styles.botonEliminar}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textoBoton}>Eliminar Usuario</Text>
          </Pressable>

          <Pressable
            style={styles.botonVolver}
            onPress={() => router.replace('/(tabs)/consulta')}
          >
            <Text style={styles.textoBotonVolver}>Volver a la lista</Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* Modal de confirmación para Eliminar */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitulo}>Confirmar Eliminación</Text>
            <Text style={styles.modalMensaje}>
              ¿Estás seguro de que deseas eliminar al usuario "{nombre}"? Esta acción no se puede deshacer.
            </Text>

            <View style={styles.modalBotones}>
              <Pressable
                style={[styles.botonModal, styles.botonCancelarModal]}
                onPress={() => setModalVisible(false)}
                disabled={eliminando}
              >
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.botonModal, styles.botonConfirmarModal]}
                onPress={confirmarEliminacion}
                disabled={eliminando}
              >
                {eliminando ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoConfirmarModal}>Sí, Eliminar</Text>
                )}
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1F2937',
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
  },
  linea: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },
  info: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 10,
  },
  botonEditar: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  botonEliminar: {
    backgroundColor: '#EF4444',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botonVolver: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  textoBotonVolver: {
    color: '#4B5563',
    fontSize: 16,
  },

  /* Estilos para Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMensaje: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalBotones: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  botonModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  botonCancelarModal: {
    backgroundColor: '#E5E7EB',
  },
  botonConfirmarModal: {
    backgroundColor: '#EF4444',
  },
  textoCancelarModal: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoConfirmarModal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});