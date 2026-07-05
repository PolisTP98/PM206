import { 
    View, 
    Image, 
    Text, 
    StyleSheet 
} from "react-native";

export default function SplashScreen() {
    return (
        <View style = {styles.container}>
            <Image 
                source = {require("../assets/libros.png")} 
                style = {styles.logo} 
                resizeMode = "contain"
            />
            <Text style = {styles.texto}>Biblioteca - repaso2</Text>
        </View>
    );
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        backgroundColor: "#ffffff", 
        justifyContent: "center", 
        alignItems: "center", 
    }, 
    logo: { 
        width: 200, 
        height: 200, 
    }, 
    texto: { 
        fontFamily: "Arial", 
        fontSize: 22, 
        fontWeight: "bold", 
        color: "#000000", 
        marginTop: 20, 
    }, 
});