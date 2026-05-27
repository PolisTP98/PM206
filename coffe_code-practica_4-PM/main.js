import { 
    crearBaseDeDatos, 
    leerBaseDeDatos 
} from "./base_de_datos.js";
import { inicializarDatosEstaticos } from "./seed.js";


async function arrancarSistema() {
    try {
        crearBaseDeDatos();
        const base_de_datos = leerBaseDeDatos();
        await inicializarDatosEstaticos(base_de_datos);
        console.log("========== BASE DE DATOS Y DATOS ESTÁTICOS INICIALIZADOS CON ÉXITO ==========");
    }
    catch(error) {
        console.error(`ERROR CRÍTICO AL ARRANCAR EL SISTEMA: ${error.message}`);
        process.exit(1);
    }
}


arrancarSistema();