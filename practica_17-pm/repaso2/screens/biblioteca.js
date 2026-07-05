import React, { 
    useState, 
    useEffect, 
    useMemo, 
} from "react";
import { useSafeAreaInsets, } from "react-native-safe-area-context";
import { 
    Platform, 
    Keyboard, 
    Alert, 
    ImageBackground, 
    KeyboardAvoidingView, 
    FlatList, 
    View, 
    TextInput, 
    Text, 
    Image, 
    Pressable, 
    ActivityIndicator, 
    StyleSheet, 
} from "react-native";

export default function Biblioteca() {
    const insets = useSafeAreaInsets();
    const[busqueda, setBusqueda] = useState("");
    const[tituloLibro, setTituloLibro] = useState("");
    const[autorLibro, setAutorLibro] = useState("");
    const[generoLibro, setGeneroLibro] = useState("");
    const[libros, setLibros] = useState([]);
    const[idLibroEditar, setIdLibroEditar] = useState(null);
    const[cargando, setCargando] = useState(false);

    const alertas = (titulo, mensaje) => {
        if(Platform.OS === "web") {
            alert(`${titulo}: ${mensaje}`);
        }
        else {
            Alert.alert(titulo, mensaje);
        }
    };

    const resetearValores = () => {
        setBusqueda("");
        setTituloLibro("");
        setAutorLibro("");
        setGeneroLibro("");
        setIdLibroEditar(null);
    };

    const busquedas = (texto) => {
        setBusqueda(texto);
    };

    const librosFiltrados = useMemo(() => {
        return !busqueda?.trim() 
            ? libros 
            : libros.filter(libro => 
                libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                libro.autor.toLowerCase().includes(busqueda.toLowerCase()) || 
                libro.genero.toLowerCase().includes(busqueda.toLowerCase())
            )
    }, [libros, busqueda]);

    const procesarRegistro = () => {
        if(Platform.OS !== "web") {
            Keyboard.dismiss();
        }
        const camposVacios = [];
        if(!tituloLibro?.trim()) {
            camposVacios.push("- Título del libro");
        }
        if(!autorLibro?.trim()) {
            camposVacios.push("- Autor del libro");
        }
        if(!generoLibro?.trim()) {
            camposVacios.push("- Género del libro");
        }
        if(camposVacios.length > 0) {
            alertas("Campos vacíos", `Debes llenar los siguientes campos del formulario:\n${camposVacios.join("\n")}`);
            return false;
        }
        return true;
    };

    const guardarLibro = (id) => {
        try {
            if(!id) {
                const idLibro = libros.length > 0 ? libros[libros.length - 1].id + 1 : 1;
                const libroNuevo = { 
                    id: idLibro, 
                    titulo: tituloLibro, 
                    autor: autorLibro, 
                    genero: generoLibro, 
                };
                const nuevaListaLibros = [...libros, libroNuevo];
                setLibros(nuevaListaLibros);
            }
            else {
                const libroEditado = libros.map(libro => {
                    if(libro.id === id) {
                        return { 
                            id: id, 
                            titulo: tituloLibro, 
                            autor: autorLibro, 
                            genero: generoLibro, 
                        };
                    }
                    else {
                        return libro;
                    }
                });
                setLibros(libroEditado);
            }
            resetearValores();
        }
        catch(exception) {
            alertas("Excepción", exception);
        }
    };

    const almacenarLibro = async(id = null) => {
        if(!procesarRegistro()) {
            return;
        }
        setCargando(true);
        await new Promise(resolve => setTimeout(resolve, 4000));
        setCargando(false);
        guardarLibro(id);
    }

    const editarLibro = (id) => {
        const informacionLibro = libros.find(libro => libro.id === id);
        if(informacionLibro) {
            setIdLibroEditar(id);
            setTituloLibro(informacionLibro.titulo);
            setAutorLibro(informacionLibro.autor);
            setGeneroLibro(informacionLibro.genero);
        }
    };

    const eliminarLibro = (id) => {
        const librosRestantes = libros.filter(libro => libro.id !== id);
        setLibros(librosRestantes);
        resetearValores();
    };

    const formularioLibros = () => (
        <View style = {styles.formulario}>
            <View style = {styles.buscador}>
                <TextInput 
                    style = {[styles.campoEntrada, styles.texto, styles.textoNegro]} 
                    placeholder = "Buscar libro por título, autor o género..." 
                    placeholderTextColor = "#828282" 
                    value = {busqueda} 
                    editable = {!cargando} 
                    onChangeText = {busquedas} 
                    autoCorrect = {false} 
                    autoCapitalize = "none" 
                    maxLength = {255}
                />
                <Image 
                    style = {styles.lupa} 
                    source = {require("../assets/search.png")}
                />
            </View>
            <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita, styles.tituloFormulario, styles.textoCentrado, styles.mt40]}>Catálogo de libros</Text>
            <TextInput 
                style = {[styles.campoEntrada, styles.texto, styles.textoNegro, styles.mt20]} 
                placeholder = "Título del libro" 
                placeholderTextColor = "#828282" 
                value = {tituloLibro} 
                editable = {!cargando} 
                onChangeText = {setTituloLibro} 
                maxLength = {255}
            />
            <TextInput 
                style = {[styles.campoEntrada, styles.texto, styles.textoNegro, styles.mt10]} 
                placeholder = "Autor del libro" 
                placeholderTextColor = "#828282" 
                value = {autorLibro} 
                editable = {!cargando} 
                onChangeText = {setAutorLibro} 
                maxLength = {255}
            />
            <TextInput 
                style = {[styles.campoEntrada, styles.texto, styles.textoNegro, styles.mt10]} 
                placeholder = "Género del libro" 
                placeholderTextColor = "#828282" 
                value = {generoLibro} 
                editable = {!cargando} 
                onChangeText = {setGeneroLibro} 
                maxLength = {100}
            />
            <Pressable 
                style = {cargando ? [styles.boton, styles.botonRojo, styles.botonDeshabilitado, styles.mt20] : [styles.boton, styles.botonRojo, styles.mt20]} 
                disabled = {cargando} 
                onPress = {() => almacenarLibro(idLibroEditar)}
            >
                {cargando 
                    ? <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita]}>Guardando...</Text> 
                    : idLibroEditar 
                        ? <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita]}>Guardar</Text> 
                        : <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita]}>Agregar libro</Text>
                }
            </Pressable>
            {cargando && (
                <View style = {styles.mt20}>
                    <ActivityIndicator 
                        style = {styles.mb20} 
                        size = "small" 
                        color = "#d20a2e"
                    />
                    <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita, styles.textoCentrado]}>
                        {idLibroEditar 
                            ? "Guardando cambios..." 
                            : "Guardando libro..."
                        }
                    </Text>
                </View>
            )}
            <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita, styles.mt20, styles.mb20]}>Total de libros: {libros.length}</Text>
        </View>
    );

    return (
        <ImageBackground 
            style = {styles.fondo} 
            imageStyle = {styles.imagen} 
            source = {{uri: "https://i.pinimg.com/736x/74/f0/8c/74f08cce3e91bda0eb131b772fa91940.jpg"}} 
            resizeMode = "cover"
        >
            <View style = {[styles.contenedor, { paddingTop: insets.top + 30 }]}>
                <KeyboardAvoidingView 
                    style = {{ flex: 1 }} 
                    behavior = {Platform.OS === "ios" ? "padding" : "height"}
                >
                    <FlatList 
                        data = {librosFiltrados} 
                        keyExtractor = {(item) => item.id.toString()} 
                        ListHeaderComponent = {formularioLibros()} 
                        keyboardShouldPersistTaps = "handled" 
                        contentContainerStyle = {styles.scrollContenedor} 
                        renderItem = {({ item }) => (
                            <View style = {[styles.libro, styles.mb10]}>
                                <View>
                                    <Text style = {[styles.texto, styles.textoNegro, styles.textoNegrita, styles.tituloLibro, styles.mb5]}>{item.titulo}</Text>
                                    <Text style = {[styles.texto, styles.textoNegro]}>Autor: {item.autor}</Text>
                                    <Text style = {[styles.texto, styles.textoNegro]}>Género: {item.genero}</Text>
                                </View>
                                <View>
                                    <Pressable 
                                        style = {cargando 
                                            ? [styles.boton, styles.botonRojo, styles.botonDeshabilitado, styles.mb10] 
                                            : [styles.boton, styles.botonRojo, styles.mb10]
                                        } 
                                        disabled = {cargando} 
                                        onPress = {() => editarLibro(item.id)}
                                    >
                                        <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita]}>Editar</Text>
                                    </Pressable>
                                    <Pressable 
                                        style = {cargando 
                                            ? [styles.boton, styles.botonRojo, styles.botonDeshabilitado] 
                                            : [styles.boton, styles.botonRojo]
                                        } 
                                        disabled = {cargando} 
                                        onPress = {() => eliminarLibro(item.id)}
                                    >
                                        <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita]}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent = {
                            <Text style = {[styles.texto, styles.textoBlanco, styles.textoNegrita, styles.textoCentrado, styles.mt20]}>No se encontraron libros...</Text>
                        }
                    />
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({ 
    contenedor: { 
        flex: 1, 
        padding: 20, 
    }, 
    fondo: { 
        flex: 1, 
        backgroundColor: "#000000", 
    }, 
    imagen: { 
        opacity: 0.5, 
    }, 
    buscador: { 
        position: "relative", 
        flexDirection: "row", 
        alignItems: "center", 
    }, 
    lupa: { 
        position: "absolute", 
        right: 10, 
        width: 20, 
        height: 20, 
        zIndex: 1, 
    }, 
    formulario: { 
        width: "100%", 
    }, 
    tituloFormulario: { 
        fontSize: 22, 
    }, 
    texto: { 
        fontFamily: "Arial", 
        fontSize: 14, 
    }, 
    tituloLibro: { 
        fontSize: 18, 
    }, 
    textoNegrita: { 
        fontWeight: "bold", 
    }, 
    textoBlanco: { 
        color: "#ffffff", 
    }, 
    textoNegro: { 
        color: "#000000", 
    }, 
    textoCentrado: { 
        textAlign: "center", 
    }, 
    campoEntrada: { 
        flex: 1, 
        borderRadius: 20, 
        padding: 10, 
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
    }, 
    boton: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 20, 
        alignItems: "center", 
    }, 
    botonRojo: { 
        backgroundColor: "#d20a2e", 
    }, 
    botonDeshabilitado: { 
        backgroundColor: "#828282", 
    }, 
    libro: { 
        flexDirection: "row", 
        paddingVertical: 20, 
        paddingHorizontal: 40, 
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        borderRadius: 60, 
        justifyContent: "space-between", 
        alignItems: "center", 
    }, 
    mt10: { 
        marginTop: 10, 
    }, 
    mt20: { 
        marginTop: 20, 
    }, 
    mt40: { 
        marginTop: 40, 
    }, 
    mb5: { 
        marginBottom: 5, 
    }, 
    mb10: { 
        marginBottom: 10, 
    }, 
    mb20: { 
        marginBottom: 20, 
    }, 
    scrollContenedor: { 
        flexGrow: 1, 
    }, 
});