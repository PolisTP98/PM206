import * as readline from "node:readline/promises";
import { obtenerUsuarioPorCredenciales, agregarUsuario, obtenerUsuarioPorID, editarUsuario, eliminarUsuario } from "./bd.js";
import { lanzarExcepcionPorID } from "./excepciones.js";


export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


export function validarID(id) {
    if(!(id > 0) || isNaN(id)) {
        lanzarExcepcionPorID("IDErroneo");
    }
}


export function validarNoNulos(valores) {
    if(valores.some(valor => !valor || valor.trim() === "")) {
        lanzarExcepcionPorID("ValoresNull");
    }
}


export async function ingresarCredenciales() {
    const nombre = await rl.question("NOMBRE DE USUARIO\n>>> ");
    const contrasena = await rl.question("CONTRASEÑA\n>>> ");
    return { nombre, contrasena };
}


export async function logIn() {
    const { nombre, contrasena } = await ingresarCredenciales();
    validarNoNulos([nombre, contrasena]);

    const usuario = obtenerUsuarioPorCredenciales(nombre, contrasena);
    if(!usuario) {
        lanzarExcepcionPorID("CredencialesInvalidas");
    }
    console.log(`\n¡Bienvenido, ${usuario.nombre}!`);
    return usuario;
}


export async function signUp(es_admin = false) {
    const { nombre, contrasena } = await ingresarCredenciales();
    validarNoNulos([nombre, contrasena]);
    agregarUsuario(nombre, contrasena, es_admin);
}


export async function editUser() {
    const id_str = await rl.question("ID DEL USUARIO A EDITAR\n>>> ");
    const id_usuario = parseInt(id_str);
    validarID(id_usuario);

    obtenerUsuarioPorID(id_usuario);

    const { nombre, contrasena } = await ingresarCredenciales();
    validarNoNulos([nombre, contrasena]);
    editarUsuario(id_usuario, nombre, contrasena);
}


export async function deleteUser() {
    const id_str = await rl.question("ID DEL USUARIO A ELIMINAR\n>>> ");
    const id_usuario = parseInt(id_str);
    validarID(id_usuario);
    eliminarUsuario(id_usuario);
}