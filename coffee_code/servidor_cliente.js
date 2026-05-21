import { inicializarDB } from "./bd.js";
import { rl, logIn, signUp } from "./controlador.js";
import { obtenerPedidosPorUsuario, crearPedidoMenu } from "./caja.js";
import { verMenuCliente, obtenerProductosPublicos } from "./cliente.js";


inicializarDB();

let usuario_cliente = null;

function verMenuLogInSignUp() {
    console.log(`
        ==========================================
        | (1) INICIAR SESIÓN                     |
        | (2) ¿NO TIENES UNA CUENTA? REGISTRARSE |
        ==========================================
    \n`);
}


async function logInSignUp() {
    if (usuario_cliente !== null) return; 

    let valida = false;
    while (!valida) {
        console.clear();
        verMenuLogInSignUp();
        let entrada = await rl.question(">>> ");
        
        if (entrada === "1") {
            console.clear();
            usuario_cliente = await logIn();
            valida = true;
        } else if (entrada === "2") {
            console.clear();
            await signUp(false);
            console.log("\n========== REGISTRO EXITOSO. FAVOR DE INICIAR SESIÓN ==========");
            await rl.question("[ENTER] PARA CONTINUAR");
        } else {
            console.log("========== OPCIÓN INVÁLIDA ==========");
            await rl.question("[ENTER] PARA CONTINUAR");
        }
    }
}


async function main() {
    let breakpoint = "";
    
    while (breakpoint.toLowerCase() !== "s") {
        try {
            console.clear();
            if(usuario_cliente) console.log(`¡BIENVENIDO A BIG CAESARS ${usuario_cliente.nombre}!\nPOR FAVOR SELECCIONE LA OPCIÓN A REALIZAR:\n\n`);
            verMenuCliente();
            breakpoint = await rl.question(">>> ");
            
            switch(breakpoint) {
                case "1":
                    console.clear();
                    obtenerProductosPublicos();
                    await rl.question("\n[ENTER] PARA CONTINUAR");
                    break;
                case "2":
                    await logInSignUp();
                    console.clear();
                    obtenerProductosPublicos();
                    await crearPedidoMenu(usuario_cliente.id_usuario);
                    break;
                case "3":
                    await logInSignUp();
                    console.clear();
                    console.log(`
                        =================================
                        |          MIS PEDIDOS          |
                        =================================
                    `);
                    obtenerPedidosPorUsuario(usuario_cliente.id_usuario);
                    await rl.question("\n[ENTER] PARA CONTINUAR");
                    break;
            }
        }
        catch(e) {
            console.clear();
            console.log(`\n
                ===========================================
                |          EXCEPCIÓN DEL SISTEMA          |
                ===========================================
                ${e.nombre}: ${e.mensaje}\n
            `);
            await rl.question("[ENTER] PARA CONTINUAR");
        }
    }
    console.log("\n========== ¡GRACIAS POR VISITAR BIG CAESARS! ==========");
    rl.close();
}


main();