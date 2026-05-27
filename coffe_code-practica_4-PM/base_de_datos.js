import { 
    readFileSync, 
    writeFileSync, 
    existsSync 
} from "node:fs";


const ARCHIVO_BASE_DE_DATOS = "./base_de_datos.json";


export function leerBaseDeDatos() {
    try {
        const contenido = readFileSync(ARCHIVO_BASE_DE_DATOS, "utf-8");
        return JSON.parse(contenido);
    }
    catch(error) {
        throw error;
    }
}


export function guardarBaseDeDatos(registros) {
    try {
        writeFileSync(ARCHIVO_BASE_DE_DATOS, JSON.stringify(registros, null, 4), "utf-8");
    }
    catch(error) {
        throw error;
    }
}


export function crearBaseDeDatos() {
    try {
        if(!existsSync(ARCHIVO_BASE_DE_DATOS)) {
            const estructura_base_de_datos = {
                usuarios: [ { id_usuario: 1, nombre: "PolisTP98", contrasena: "PolisTP98", id_rol: 1 } ], 
                productos: [], 
                pedidos: [], 
                roles: [], 
                categorias: [], 
                ingredientes: [], 
                estados: [], 
                excepciones: []
            };
            guardarBaseDeDatos(estructura_base_de_datos);
        }
    }
    catch(error) {
        throw error;
    }
}