import { crearRegistro } from "./controlador.js";
import { guardarBaseDeDatos } from "./base_de_datos.js";


export class Rol {
    constructor({ id_rol, nombre, descripcion }) {
        this.id_rol = id_rol;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}


export class Categoria {
    constructor({ id_categoria, nombre }) {
        this.id_categoria = id_categoria;
        this.nombre = nombre;
    }
}


export class Ingrediente {
    constructor({ id_ingrediente, nombre }) {
        this.id_ingrediente = id_ingrediente;
        this.nombre = nombre;
    }
}


export class Estado {
    constructor({ id_estado, nombre, descripcion }) {
        this.id_estado = id_estado;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}


export class Excepcion {
    constructor({ id_excepcion, nombre, descripcion }) {
        this.id_excepcion = id_excepcion;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}


export async function inicializarDatosEstaticos(base_de_datos) {
    let cambios = false;
    if(base_de_datos.roles.length === 0) {
        const roles_base = [
            { nombre: "Administrador", descripcion: "Encargado de la gestión de usuarios del sistema" }, 
            { nombre: "Caja", descripcion: "Encargado de la captura de pedidos y finanzas" }, 
            { nombre: "Cocina", descripcion: "Encargado de la preparación de pedidos" }, 
            { nombre: "Cliente", descripcion: "Usuario que utiliza el sistema" }
        ];
        for(const rol of roles_base)
            await crearRegistro(rol, Rol, base_de_datos);
        cambios = true;
    }
    if(base_de_datos.categorias.length === 0) {
        const categorias_base = [
            { nombre: "Combo" }, 
            { nombre: "Alimento" }, 
            { nombre: "Complemento" }, 
            { nombre: "Bebida" }
        ];
        for(const categoria of categorias_base)
            await crearRegistro(categoria, Categoria, base_de_datos);
        cambios = true;
    }
    if(base_de_datos.ingredientes.length === 0) {
        const ingredientes_base = [
            { nombre: "Masa clásica" }, 
            { nombre: "Salsa de tomate tradicional" }, 
            { nombre: "Salsa BBQ" }, 
            { nombre: "Salsa buffalo" }, 
            { nombre: "Queso mozzarella" }, 
            { nombre: "Queso muenster" }, 
            { nombre: "Queso extra" }, 
            { nombre: "Queso parmesano rallado" }, 
            { nombre: "Pepperoni" }, 
            { nombre: "Salchicha italiana" }, 
            { nombre: "Tocino" }, 
            { nombre: "Jamón" }, 
            { nombre: "Carne molida de res" }, 
            { nombre: "Pollo deshebrado" }, 
            { nombre: "Champiñones" }, 
            { nombre: "Pimiento verde" }, 
            { nombre: "Cebolla" }, 
            { nombre: "Aceitunas negras" }, 
            { nombre: "Piña" }, 
            { nombre: "Chiles jalapeños" }, 
            { nombre: "Mantequilla de ajo" }, 
            { nombre: "Sazonador italiano" }
        ];
        for(const ingrediente of ingredientes_base)
            await crearRegistro(ingrediente, Ingrediente, base_de_datos);
        cambios = true;
    }
    if(base_de_datos.estados.length === 0) {
        const estados_base = [
            { nombre: "Pendiente", descripcion: "El pedido llegó a cocina, pero aún no está en preparación" }, 
            { nombre: "En Preparación", descripcion: "El pedido está en preparación" }, 
            { nombre: "Completado", descripcion: "El pedido ha sido completado, pero aún no se entregó al cliente" }, 
            { nombre: "Entregado", descripcion: "El pedido ha sido entregado al cliente" }, 
            { nombre: "Cancelado", descripcion: "El pedido fue cancelado por uno o diversos motivos" }
        ];
        for(const estado of estados_base)
            await crearRegistro(estado, Estado, base_de_datos);
        cambios = true;
    }
    if(base_de_datos.excepciones.length === 0) {
        const excepciones_base = [
            { nombre: "ObjetoInexistente", descripcion: "No existe el objeto proporcionado" }, 
            { nombre: "CamposObligatoriosVacios", descripcion: "Debes llenar todos los campos obligatorios del formulario" }, 
            { nombre: "IDInvalido", descripcion: "No existe ningún registro con el ID proporcionado" }, 
            { nombre: "NoEsNumero", descripcion: "Debes ingresar un valor numérico" }, 
            { nombre: "RegistroInexistente", descripcion: "No existe el registro con los campos proporcionados" }, 
            { nombre: "RegistroExistente", descripcion: "Ya existe un registro con el nombre proporcionado" }, 
            { nombre: "CredencialesInvalidas", descripcion: "Nombre o contraseña incorrectas" }, 
            { nombre: "RolIncorrecto", descripcion: "Este usuario no tiene permisos para acceder a este módulo" }
        ];
        for(const excepcion of excepciones_base)
            await crearRegistro(excepcion, Excepcion, base_de_datos);
        cambios = true;
    }
    if(cambios)
        await guardarBaseDeDatos(base_de_datos);
    return base_de_datos;
}