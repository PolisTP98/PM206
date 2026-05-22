import { leerDB, guardarDB } from "./bd.js";


function agregarExcepcion(id_excepcion, nombre, mensaje) {
    const db = leerDB();

    const nuevaExcepcion = { id_excepcion, nombre, mensaje };
    db.excepciones.push(nuevaExcepcion);
    guardarDB(db);
}


export function inicializarExcepciones() {
    agregarExcepcion("IDInvalido", "Error", "No existe un registro con el ID proporcionado.");
}


export function lanzarExcepcionPorID(id_excepcion) {
    const db = leerDB();
    const excepcion = db.excepciones.find(e => e.id_excepcion === id_excepcion);
    if(!excepcion) throw db.excepciones["IDInvalido"];
    throw excepcion;
}