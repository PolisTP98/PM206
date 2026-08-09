import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Alert, 
  Platform 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const API_URL = 
    Platform.OS === "web" 
      ? "http://localhost:5000/v1/"
      : process.env.EXPO_PUBLIC_API_URL;
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [cargando, setCargando] = useState(false);

  const mostrarMensaje= (titulo, mensaje) => {
    if(Platform.OS === "web") {
      window.alert(`${titulo}\n${mensaje}`);
    }
    else {
      Alert.alert(titulo, mensaje);
    }
  };

  const guardarUsuario = async() => {
    if(!nombre?.trim() || !edad?.trim()) {
      mostrarMensaje("Campos vacíos", "Che boludo, debés llenar todos los campos bobín (se roba tus datos sensibles)");
      return;
    }

    try {
      setCargando(true);
      const respuesta = await fetch(`${API_URL}usuarios/`, 
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json"
          }, 
          body: JSON.stringify({nombre: nombre, edad: Number(edad)})
        }
      );
      const textoRespuesta = await respuesta.text();
      console.log(`Respuesta del servidor:\n${textoRespuesta}`);
      if(respuesta.ok) {
        const datos = JSON.parse(textoRespuesta);
        console.log(`Respuesta de la API:\n${datos}`);
      }
      else {
        console.error(`Error del servidor (${respuesta.status}): ${textoRespuesta}`);
      }
      mostrarMensaje("Éxito", "Usuario registrado correctamente");
      setNombre("");
      setEdad("");
    }
    catch(error) {
      console.error(`[ERROR]: ${error}`);
      mostrarMensaje("Error", "No fue posible guardar el usuario, intente nuevamente más tarde");
    }
    finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.card}>
        <Text style = {styles.titulo}>Registro de usuarios</Text>

        <TextInput 
          style = {styles.input} 
          placeholder = "Nombre del usuario" 
          value = {nombre} 
          onChangeText = {setNombre}
        />

        <TextInput 
          style = {styles.input} 
          placeholder = "Edad del usuario" 
          keyboardType = "numeric" 
          value = {edad} 
          onChangeText = {setEdad}
        />

        <Pressable 
          style = {styles.boton} 
          onPress = {guardarUsuario} 
          disabled = {cargando} 
        >
          <Text style = {styles.textoBoton}>

          {cargando? "Agregando usuario..." : "Agregar usuario"}
          
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: "#F5F7FA", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
  }, 
  card: { 
    width: "100%", 
    backgroundColor: "#FFFFFF", 
    padding: 25, 
    borderRadius: 15, 
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    shadowOffset: { 
      width: 0, 
      height: 3, 
    }, 
  }, 
  titulo: { 
    fontSize: 26, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 25, 
    color: "#1F2937", 
  }, 
  input: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: "#D1D5DB", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 18, 
    backgroundColor: "#F9FAFB", 
    fontSize: 16, 
  }, 
  boton: { 
    backgroundColor: "#29bb0c", 
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: "center", 
    marginTop: 10, 
  }, 
  textoBoton: { 
    color: "#FFF", 
    fontSize: 17, 
    fontWeight: "bold", 
  }, 
});