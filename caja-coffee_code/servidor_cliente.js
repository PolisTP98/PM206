import { 
    agregarExcepcion, 
    ingresarCredenciales, 
    validarCredenciales, 
    logIn, 
    signUp, 
    editUser, 
    deleteUser 
} from "./controlador.js";
import { 
    agregarPedido, 
    obtenerPedidos 
} from "./caja.js";
import { 
    verMenuCliente,  
    obtenerProductos 
} from "./cliente.js";
import { rl } from "./cocina.js";
import { resetearBreakpoints } from "./servidor_admin.js";
let id_usuario = null, nombre, contrasena, breakpoint, entrada1, entrada2;


function verMenuLogInSignUp() {
    console.log(`
        POR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:

        ==========================================
        | (1) INICIAR SESIÓN                     |
        | (2) ¿NO TIENES UNA CUENTA? REGISTRARSE |
        ==========================================
    \n`);
}


export function logInSignUp() {
    if(!(id_usuario === null)) return;
    verMenuLogInSignUp();
    while(!(["1", "2"].includes(entrada1)))
    entrada1 = await rl.question(">>> ");
    switch(entrada1) {
        case "1":
            console.clear();
            logIn();
            break;
        case "2":
            console.clear();
            signUp();
            break;
        default:
            throw new agregarExcepcion(
                "OpcionInvalida", 
                "No existe la opción ingresada, favor de intentarlo nuevamente"
            );
            break;
    }
}


async function main() {
    resetearBreakpoints();
    while(["1", "2", "3"].includes(breakpoint)) {
        try {
            console.clear();
            verMenuCliente();
            breakpoint = await rl.question(">>> ");
            switch(breakpoint) {
                case "1":
                    obtenerProductos();
                    entrada2 = await rl.question("");
                    break;
                case "2":
                    logInSignUp();
                    obtenerProductos();
                    crearPedido();
                    break;
                case "3":
                    logInSignUp();
                    obtenerPedidos(id_usuario);
                    entrada2 = await rl.question("");
                    break;
            }
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