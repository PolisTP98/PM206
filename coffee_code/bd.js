import { 
    agregarRegistro, 
    obtenerRegistro 
} from "./controlador.js";
const lista_usuarios = [];
let id_usuario = 1;


class usuarios {
    constructor(nombre, contrasena, es_admin) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.es_admin = es_admin;
    }
}


export function agregarUsuario(nombre, contrasena, es_admin) {
    const usuario = new usuarios(id_usuario, nombre, contrasena, es_admin);
    agregarRegistro(lista_usuarios, id_usuario, usuario);
}


agregarUsuario(
    "Isaac Abdiel Sánchez López", 
    "12345", 
    es_admin = true
);


function verUsuario(usuario) {
    console.log(`\n
        ID USUARIO: ${usuario.id_usuario}
        NOMBRE: ${usuario.nombre}
        ES ADMIN: ${usuario.es_admin}
    `);
}


export function obtenerUsuarios(es_admin) {
    const usuarios;
    if(es_admin !== undefined) {
        if(es_admin) usuarios = lista_usuarios.filter(usuario => usuario.es_admin === true);
        else usuarios = lista_usuarios.filter(usuario => usuario.es_admin === false);
    }
    else usuarios = lista_usuarios;
    usuarios.forEach(usuario => {
        verUsuario(usuario);
    });
}


export function obtenerUsuario(nombre, contrasena) {
    const usuario = lista_usuarios.filter(usuario => 
        usuario.nombre === nombre && usuario.contrasena === contrasena
    );
    return usuario;
}


export function obtenerUsuarioPorID(id_usuario) {
    const usuario = obtenerRegistro(lista_usuarios, id_usuario);
    verUsuario(usuario);
    return usuario;
}


export function editarUsuario(id_usuario, nombre, contrasena) {
    const usuario = obtenerUsuarioPorID(id_usuario);
    usuario.nombre = nombre ?? usuario.nombre, usuario.contrasena = contrasena ?? usuario.contrasena;
}


export function eliminarUsuario(id_usuario) {
    const usuario = obtenerUsuarioPorID(id_usuario), index_usuario = lista_usuarios.indexOf(usuario);
    lista_usuarios.splice(index_usuario, 1);
}