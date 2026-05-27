import { leerDB, guardarDB } from "./bd.js";


class excepciones {
    constructor(id_excepcion, nombre, mensaje) {
        this.id_excepcion = id_excepcion;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}


function agregarExcepcion(id_excepcion, nombre, mensaje) {
    const db = leerDB();

    const nuevaExcepcion = new excepciones(id_excepcion, nombre, mensaje);
    db.excepciones.push(nuevaExcepcion);
    guardarDB(db);
}


export function inicializarExcepciones() {
    agregarExcepcion("IDInvalido", "ID inexistente", "No existe un registro con el ID proporcionado.");
    agregarExcepcion("IDErroneo", "ID negativo", "Un ID debe ser un número entero mayor a 0.");
    agregarExcepcion("ValoresNull", "Campos vacíos", "No es posible dejar campos vacíos.");
    agregarExcepcion("CredencialesInvalidas", "Error de autenticación", "Nombre o contraseña incorrectas.");
}


export function lanzarExcepcionPorID(id_excepcion) {
    const db = leerDB();
    const excepcion = db.excepciones.find(e => e.id_excepcion === id_excepcion);
    if(!excepcion) throw db.excepciones["IDInvalido"];
    throw `
    ID EXCEPCIÓN: ${excepcion.id_excepcion}
    NOMBRE: ${excepcion.nombre}
    MENSAJE: ${excepcion.mensaje}
    `;
}