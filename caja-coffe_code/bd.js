import fs from "fs";
import { inicializarExcepciones } from "./excepciones";
const DB_FILE = "./bd.json";


export function inicializarDB() {
    if(!fs.existsSync(DB_FILE)) {
        const estructura_db = {
            usuarios: [
                { id_usuario: 1, nombre: "PolisTP98", contrasena: "PolisTP98", es_admin: true }
            ],
            inventario: [
                { id_producto: 1, nombre: "Pizza Clasica de Pepperoni", categoria: "Pizza", precio: 99.00, ingredientes: ["Masa original", "Salsa de tomate", "Queso", "Pepperoni"] },
                { id_producto: 2, nombre: "Pizza de Queso", categoria: "Pizza", precio: 89.00, ingredientes: ["Masa original", "Salsa de tomate", "Extra queso"] },
                { id_producto: 3, nombre: "Crazy Bread", categoria: "Complemento", precio: 49.00, ingredientes: ["Masa original", "Mantequilla de ajo", "Queso parmesano"] }
            ],
            pedidos: [],
            excepciones: []
        };
        guardarDB(estructura_db);
    }
}
inicializarExcepciones();


export function leerDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}


export function guardarDB(datos) {
    fs.writeFileSync(DB_FILE, JSON.stringify(datos, null, 4));
}


export function agregarUsuario(nombre, contrasena, es_admin) {
    const db = leerDB();
    const id_usuario = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(usuario => usuario.id_usuario)) + 1 : 1;

    const nuevoUsuario = { id_usuario, nombre, contrasena, es_admin };
    db.usuarios.push(nuevoUsuario);
    guardarDB(db);
}


function verUsuario(usuario) {
    console.log(`
        ID USUARIO: ${usuario.id_usuario}
        NOMBRE: ${usuario.nombre}
        ES ADMIN: ${usuario.es_admin}
    `);
}


export function obtenerUsuarios(es_admin = undefined) {
    const db = leerDB();
    let usuarios = db.usuarios;

    if(es_admin !== undefined) {
        usuarios = usuarios.filter(usuario => usuario.es_admin === es_admin);
    }

    if(usuarios.length === 0) console.log("\n========== NO HAY USUARIOS REGISTRADOS ==========");
    usuarios.forEach(usuario => verUsuario(usuario));
}


export function obtenerUsuarioPorCredenciales(nombre, contrasena) {
    const db = leerDB();
    return db.usuarios.find(usuario => usuario.nombre === nombre && usuario.contrasena === contrasena);
}


export function obtenerUsuarioPorID(id_usuario) {
    const db = leerDB();
    const usuario = db.usuarios.find(usuario => usuario.id_usuario === id_usuario);
    if(!usuario) lanzarExcepcionPorID("IDInvalido");
    verUsuario(usuario);
    return usuario;
}


export function editarUsuario(id_usuario, nombre, contrasena) {
    const db = leerDB();
    const index = db.usuarios.findIndex(usuario => usuario.id_usuario === id_usuario);
    if(index === -1) lanzarExcepcionPorID("IDInvalido");

    if(nombre) db.usuarios[index].nombre = nombre;
    if(contrasena) db.usuarios[index].contrasena = contrasena;

    guardarDB(db);
}


export function eliminarUsuario(id_usuario) {
    const db = leerDB();
    const index = db.usuarios.findIndex(u => u.id_usuario === id_usuario);
    if(index === -1) lanzarExcepcionPorID("IDInvalido");

    db.usuarios.splice(index, 1);
    guardarDB(db);
}