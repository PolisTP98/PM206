import { 
    agregarUsuario, 
    editarUsuario, 
    eliminarUsuario, 
    obtenerUsuarioPorID 
} from "./bd.js";
import { agregarPedido } from "./caja.js";
import { obtenerProducto } from "./cliente.js";
import { rl } from "./cocina.js";
const lista_excepciones = [], id_usuario;
let id_excepcion = 1;


class excepciones {
    constructor(nombre, mensaje) {
        this.id_excepcion = id_excepcion;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}


export function agregarExcepcion(nombre, mensaje) {
    let excepcion = new excepciones(id_excepcion, nombre, mensaje);
    agregarRegistro(lista_excepciones, id_excepcion, excepcion);
}


export async function ocultarTexto(mensaje) {
    return new Promise((resolve) => {
        process.stdout.write(mensaje);
        rl.input.on("data", (key) => {
            if(key === "\n" || key === "\r" || key === "\u0004") {
                console.log();
                return resolve();
            }
        });
    });
}


export function esNull(lista_valores) {
    lista_valores.array.forEach(valor => {
        if(!valor || valor.trim() === "") valor = null;
    });
}


export function validarID(id) {
    if(!(id > 0))
        throw new agregarExcepcion(
            "IDInvalido", 
            "Un ID no puede ser menor a 0, favor de intentarlo nuevamente"
        );
}


export function agregarRegistro(lista, id, registro) {
    lista.push(registro), id++;
}


export function obtenerRegistro(lista, id) {
    validarID(id);
    const registro = lista.filter(elemento => elemento.id === id);
    if(!registro)
        throw new agregarExcepcion(
            "RegistroInvalido", 
            "No existe ningún registro con el ID proporcionado, favor de intentarlo nuevamente"
        );
    return registro;
}


export function ingresarCredenciales() {
    nombre = await rl.question("NOMBRE DE USUARIO\n>>> ");
    contrasena = await ocultarTexto("CONTRASEÑA\n>>> ");
}


export function validarCredenciales(nombre, contrasena) {
    const usuario = obtenerUsuario(nombre, contrasena);
    if(!(usuario.nombre === nombre && usuario.contrasena === contrasena))
        throw new agregarExcepcion(
            "CredencialesInvalidas", 
            "Nombre o contraseña incorrectas, favor de intentarlo nuevamente"
        );
    return usuario.id_usuario;
}


export function logIn() {
    ingresarCredenciales();
    id_usuario = validarCredenciales(nombre, contrasena);
}


export function signUp(es_admin = false) {
    ingresarCredenciales();
    esNull([nombre, contrasena]);
    if(nombre === null || contrasena === null)
        throw new agregarExcepcion(
            "ValoresNull", 
            "No es posible dejar campos vacíos en el registro, favor de intentarlo nuevamente"
        );
    agregarUsuario(nombre, contrasena, es_admin);
}


export function editUser() {
    entrada2 = await rl.question("ID DEL USUARIO A EDITAR\n>>> ");
    const id_usuario_editar = parseInt(entrada2), usuario_editar = obtenerUsuarioPorID(id_usuario_editar);
    ingresarCredenciales();
    esNull([nombre, contrasena]);
    editarUsuario(id_usuario_editar, nombre, contrasena);
}


export function deleteUser() {
    entrada2 = await rl.question("ID DEL USUARIO A ELIMINAR\n>>> ");
    const id_usuario_eliminar = parseInt(entrada2), usuario_eliminar = obtenerUsuarioPorID(id_usuario_eliminar);
    eliminarUsuario(id_usuario_eliminar);
}


export function crearPedido() {
    while(entrada1 === "1") {
        entrada2 = await rl.question("ID DEL PRODUCTO A AGREGAR AL PEDIDO\n>>> ");
        const id_producto_agregar = parseInt(entrada2), producto_agregar = obtenerProducto(id_producto_agregar);
        entrada2 = await rl.question("CANTIDAD\n>>> ");
        const cantidad = parseInt(entrada2);
        agregarPedido(id_usuario, id_producto_agregar, cantidad);
        console.log("========== PEDIDO CREADO EXITOSAMENTE ==========");
        entrada1 = await rl.question("INGRESA '1' PARA REALIZAR OTRO PEDIDO U OTRA TECLA PARA REGRESAR AL MENÚ PRINCIPAL\n>>> ");
    }
}