import { 
    crearRegistro, 
    verRegistroPorID, 
    verRegistros, 
    actualizarRegistro, 
    eliminarRegistro 
} from "./controlador.js";


export class Usuario {
    constructor({ id_usuario, nombre, contrasena, id_rol = 4 }) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.id_rol = id_rol;
    }
}


export async function crearUsuario(datos, base_de_datos) {
    return await crearRegistro(datos, Usuario, base_de_datos);
}


export function verUsuarioPorID(id_usuario, base_de_datos) {
    verRegistroPorID(id_usuario, Usuario, base_de_datos);
}


export function verUsuarios(base_de_datos, id_filtrado = undefined) {
    verRegistros(id_filtrado, Usuario, base_de_datos);
}


export async function actualizarUsuario(id_usuario, datos_nuevos, base_de_datos) {
    return await actualizarRegistro(id_usuario, datos_nuevos, Usuario, base_de_datos);
}


export async function eliminarUsuario(id_usuario, base_de_datos) {
    return await eliminarRegistro(id_usuario, Usuario, base_de_datos);
}