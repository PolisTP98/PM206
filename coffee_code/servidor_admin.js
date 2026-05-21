import {  
    ingresarCredenciales, 
    validarCredenciales, 
    logIn, 
    signUp, 
    editUser, 
    deleteUser 
} from "./controlador.js";
import { 
    verMenuCaja, 
    obtenerPedidos 
} from "./caja.js";
import { 
    rl, 
    mostrarMenu 
} from "./cocina.js";
let id_usuario = null, nombre, contrasena, breakpoint, entrada1, entrada2;


function verMenuAdministrador() {
    console.log(`
        ¡BIENVENIDO ADMINISTRADOR DE BIG CAESARS!, POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        ===============================
        | (1) CAJA                    |
        | (2) COCINA                  |
        | (3) USUARIOS                |
        |                             |
        | [ANY_KEY] SALIR DEL SISTEMA |
        ===============================
    \n`);
}


function verMenuUsuarios() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        ========================================
        | (1) AGREGAR USUARIO                  |
        | (2) VER USUARIOS                     |
        | (3) EDITAR USUARIO                   |
        | (4) ELIMINAR USUARIO                 |
        |                                      |
        | [ANY_KEY] REGRESAR AL MENÚ PRINCIPAL |
        ========================================
    \n`);
}


function verMenuUsuarios2() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        =======================================
        | (1) AGREGAR ADMINISTRADOR           |
        | (2) AGREGAR CLIENTE                 |
        |                                     |
        | [ANY_KEY] REGRESAR AL MENÚ ANTERIOR |
        =======================================
    \n`);
}


function verMenuUsuarios3() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        =======================================
        | (1) VER ADMINISTRADORES             |
        | (2) VER CLIENTES                    |
        | (3) VER TODOS LOS USUARIOS          |
        |                                     |
        | [ANY_KEY] REGRESAR AL MENÚ ANTERIOR |
        =======================================
    \n`);
}


export function resetearBreakpoints() {
    breakpoint = "1", entrada1 = "1", entrada2 = "1";
}


async function main() {
    resetearBreakpoints();
    while(["1", "2", "3"].includes(breakpoint)) {
        try {
            console.clear();
            verMenuAdministrador();
            breakpoint = await rl.question(">>> ");
            switch(breakpoint) {
                case "1":
                    logIn();
                    while(["1", "2"].includes(entrada1)) {
                        console.clear();
                        verMenuCaja();
                        entrada1 = await rl.question(">>> ");
                        switch(entrada1) {
                            case "1":
                                console.clear();
                                obtenerPedidos();
                                entrada2 = await rl.question("");
                                break;
                            case "2":
                                console.clear();
                                obtenerUsuarios(es_admin = false);
                                entrada2 = await rl.question("ID DEL CLIENTE A CONSULTAR SUS PEDIDOS\n>>> ");
                                const id_usuario = parseInt(entrada2);
                                obtenerPedidos(id_usuario);
                                entrada2 = await rl.question("");
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case "2":
                    logIn();
                    console.clear();
                    mostrarMenu();
                    entrada2 = await rl.question("");
                    break;
                case "3":
                    logIn();
                    while(["1", "2", "3", "4"].includes(entrada1)) {
                        console.clear();
                        verMenuUsuarios();
                        entrada1 = await rl.question(">>> ");
                        switch(entrada1) {
                            case "1":
                                while(["1", "2"].includes(entrada2)) {
                                    console.clear();
                                    verMenuUsuarios2();
                                    entrada2 = await rl.question(">>> ");
                                    switch(entrada2) {
                                        case "1":
                                            console.clear();
                                            signUp(es_admin = true);
                                            console.log("========== ADMINISTRADOR CREADO EXITOSAMENTE ==========");
                                            entrada2 = await rl.question("");
                                            break;
                                        case "2":
                                            console.clear();
                                            signUp();
                                            console.log("========== CLIENTE CREADO EXITOSAMENTE ==========");
                                            entrada2 = await rl.question("");
                                            break;
                                        default:
                                            break;
                                    }
                                    resetearBreakpoints();
                                }
                                break;
                            case "2":
                                while(["1", "2", "3"].includes(entrada2)) {
                                    console.clear();
                                    verMenuUsuarios3();
                                    entrada2 = await rl.question(">>> ");
                                    switch(entrada2) {
                                        case "1":
                                            console.clear();
                                            obtenerUsuarios(es_admin = true);
                                            entrada2 = await rl.question("");
                                            break;
                                        case "2":
                                            console.clear();
                                            obtenerUsuarios(es_admin = false);
                                            entrada2 = await rl.question("");
                                            break;
                                        case "3":
                                            console.clear();
                                            obtenerUsuarios();
                                            entrada2 = await rl.question("");
                                            break;
                                        default:
                                            break;
                                    }
                                    resetearBreakpoints();
                                }
                                break;
                            case "3":
                                console.clear();
                                obtenerUsuarios();
                                editUser();
                                console.log("========== USUARIO EDITADO EXITOSAMENTE ==========");
                                break;
                            case "4":
                                console.clear();
                                obtenerUsuarios();
                                deleteUser();
                                console.log("========== USUARIO ELIMINADO EXITOSAMENTE ==========");
                                break;
                            default:
                                break;
                        }
                        resetearBreakpoints();
                    }
                    break;
            }
            resetearBreakpoints();
        }
        catch(e) {
            console.clear();
            console.log(`
                ID: ${e.id_excepcion}
                NOMBRE: ${e.nombre}
                MENSAJE: ${e.mensaje}
            `);
            entrada2 = await rl.question("");
        }
        finally {
            rl.close();
        }
    }
}