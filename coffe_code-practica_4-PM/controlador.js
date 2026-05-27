import * as readline from "node:readline/promises";
import { 
    leerBaseDeDatos, 
    guardarBaseDeDatos 
} from "./base_de_datos.js";
import { Usuario } from "./usuarios.js";


const CAMPOS_NUMERICOS = [
    "id_usuario", "id_rol", "id_producto", "id_categorias", "id_ingredientes", 
    "precio", "stock", "id_pedido", "cantidad", "id_estado", "id_categoria", "id_ingrediente"
];
const CAMPOS_OBLIGATORIOS = {
    Usuario: ["nombre", "contrasena", "id_rol"], 
    Producto: ["nombre", "id_categoria", "id_ingrediente", "precio"], 
    Pedido: ["id_usuario", "id_producto", "cantidad", "id_estado"], 
    Rol: ["nombre", "descripcion"], 
    Categoria: ["nombre"], 
    Ingrediente: ["nombre"], 
    Estado: ["nombre", "descripcion"], 
    Excepcion: ["nombre", "descripcion"]
};
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function imprimirRegistro(registro) {
    Object.entries(registro).forEach(([campo, valor]) => {
        console.log(`${campo.toUpperCase()}: ${valor}`);
    });
}


function lanzarExcepcionPorNombre(nombre) {
    const base_de_datos = leerBaseDeDatos();
    const excepcion_detectada = base_de_datos.excepciones.find(excepcion => excepcion.nombre === nombre);
    if(!excepcion_detectada) {
        throw new Error(`Excepción no parametrizada: ${nombre}`);
    }
    throw new Error(`
${excepcion_detectada.nombre}
${excepcion_detectada.descripcion}
    \n`);
}


function validarCamposObligatorios(datos, Constructor) {
    const campos_obligatorios = CAMPOS_OBLIGATORIOS[Constructor.name];
    if(!campos_obligatorios)
        lanzarExcepcionPorNombre("ObjetoInexistente");
    for(const campo of campos_obligatorios)
        if(datos[campo] === undefined || datos[campo] === null || datos[campo] === "")
            lanzarExcepcionPorNombre("CamposObligatoriosVacios");
}


function obtenerIndiceRegistroPorID(id_registro, nombre_id_registro, lista_registros) {
    const indice = lista_registros.findIndex(registro => registro[nombre_id_registro] === id_registro);
    if(indice === -1)
        lanzarExcepcionPorNombre("IDInvalido");
    return indice;
}


function obtenerRegistroPorID(id_registro, nombre_id_registro, lista_registros) {
    const registro = lista_registros.find(registro => registro[nombre_id_registro] === id_registro);
    if(!registro)
        lanzarExcepcionPorNombre("IDInvalido");
    return registro;
}


function obtenerRegistrosPorID(id_registro = undefined, nombre_id_registro, lista_registros) {
    if(id_registro !== undefined) {
        const registros_filtrados = lista_registros.filter(registro => registro[nombre_id_registro] === id_registro);
        if(registros_filtrados.length === 0)
            lanzarExcepcionPorNombre("IDInvalido");
        return registros_filtrados;
    }
    return lista_registros;
}


function obtenerRecursosBaseDeDatos(Constructor, base_de_datos) {
    const nombre_constructor = Constructor.name.toLowerCase();
    let nombre_lista;
    if(nombre_constructor.endsWith("on"))
        nombre_lista = nombre_constructor.replace(/on$/, "ones");
    else if(nombre_constructor.endsWith("l") || nombre_constructor.endsWith("r"))
        nombre_lista = `${nombre_constructor}es`;
    else
        nombre_lista = `${nombre_constructor}s`;
    const nombre_id_registro = `id_${nombre_constructor}`; 
    const lista_registros = base_de_datos[nombre_lista];
    return [ nombre_id_registro, lista_registros ];
}


function limpiarDatos(datos) {
    const datos_limpios = {};
    for(const [campo, valor] of Object.entries(datos)) {
        let dato_limpio = typeof valor === "string" ? valor.trim() : valor;
        if(CAMPOS_NUMERICOS.includes(campo) && dato_limpio !== "") {
            const numero = Number(dato_limpio);
            if(!Number.isNaN(numero))
                dato_limpio = numero;
            else
                lanzarExcepcionPorNombre("NoEsNumero");
        }
        if(dato_limpio !== "" && dato_limpio !== null && dato_limpio !== undefined)
            datos_limpios[campo] = dato_limpio;
    }
    return datos_limpios;
}


export function obtenerRegistroPorCampos(campos, Constructor, base_de_datos) {
    const [ _, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    const campos_limpios = limpiarDatos(campos);
    const campos_evaluar = Object.keys(campos_limpios);
    const registro_encontrado = lista_registros.find(registro => {
        return campos_evaluar.every(campo => registro[campo] === campos_limpios[campo]);
    });
    if(!registro_encontrado)
        lanzarExcepcionPorNombre("RegistroInexistente");
    return registro_encontrado;
}


export function verRegistroPorID(id_registro, Constructor, base_de_datos) {
    const [ nombre_id_registro, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    const registro = obtenerRegistroPorID(id_registro, nombre_id_registro, lista_registros);
    imprimirRegistro(registro);
}


export function verRegistros(id_registro, Constructor, base_de_datos) {
    const [ nombre_id_registro, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    const registros = obtenerRegistrosPorID(id_registro, nombre_id_registro, lista_registros);
    registros.length === 0 
        ? console.log("========== SIN REGISTROS ==========") 
        : registros.forEach(registro => { imprimirRegistro(registro); });
}


function validarNombreUnico(nombre, id_registro, nombre_id_registro, lista_registros, Constructor) {
    const campos_obligatorios = CAMPOS_OBLIGATORIOS[Constructor.name];
    if(!campos_obligatorios || !campos_obligatorios.includes("nombre") || !nombre)
        return;
    const nombre_buscado = String(nombre).toLowerCase();
    const existe_duplicado = lista_registros.some(registro => {
        const mismo_nombre = String(registro.nombre).toLowerCase() === nombre_buscado;
        const mismo_registro = id_registro !== undefined && registro[nombre_id_registro] === id_registro;
        return mismo_nombre && !mismo_registro;
    });
    if(existe_duplicado)
        lanzarExcepcionPorNombre("RegistroExistente");
}


export async function crearRegistro(datos, Constructor, base_de_datos) {
    const datos_nuevos = limpiarDatos(datos);
    validarCamposObligatorios(datos_nuevos, Constructor);
    const [ nombre_id_registro, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    validarNombreUnico(datos_nuevos.nombre, undefined, nombre_id_registro, lista_registros, Constructor);
    const id_registro = lista_registros.length > 0 
        ? Math.max(...lista_registros.map(registro => Number(registro[nombre_id_registro]))) + 1 
        : 1;
    datos_nuevos[nombre_id_registro] = id_registro;
    const nuevo_registro = new Constructor(datos_nuevos);
    lista_registros.push(nuevo_registro);
    guardarBaseDeDatos(base_de_datos);
    return nuevo_registro;
}


export async function actualizarRegistro(id_registro, datos_nuevos, Constructor, base_de_datos) {
    const datos_actualizados = limpiarDatos(datos_nuevos);
    const [ nombre_id_registro, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    const indice_registro = obtenerIndiceRegistroPorID(id_registro, nombre_id_registro, lista_registros);
    if(datos_actualizados.nombre)
        validarNombreUnico(datos_actualizados.nombre, id_registro, nombre_id_registro, lista_registros, Constructor);
    Object.assign(lista_registros[indice_registro], datos_actualizados);
    guardarBaseDeDatos(base_de_datos);
    return lista_registros[indice_registro];
}


export async function eliminarRegistro(id_registro, Constructor, base_de_datos) {
    const [ nombre_id_registro, lista_registros ] = obtenerRecursosBaseDeDatos(Constructor, base_de_datos);
    const indice_registro = obtenerIndiceRegistroPorID(id_registro, nombre_id_registro, lista_registros);    
    const [registro_eliminado] = lista_registros.splice(indice_registro, 1);
    guardarBaseDeDatos(base_de_datos);
    return registro_eliminado;
}


export function iniciarSesionSistema(nombre, contrasena, id_rol_esperado, base_de_datos) {
    try {
        const usuario = obtenerRegistroPorCampos({ nombre, contrasena }, Usuario, base_de_datos);
        if(usuario.id_rol !== id_rol_esperado)
            lanzarExcepcionPorNombre("CredencialesInvalidas");
        return usuario;
    } catch(error) {
        console.log(error);
        lanzarExcepcionPorNombre("CredencialesInvalidas");
    }
}