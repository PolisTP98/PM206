import { inicializarDB, obtenerUsuarios } from "./bd.js";
import { rl, logIn, signUp, editUser, deleteUser } from "./controlador.js";
import { verMenuCaja, obtenerTodosLosPedidos, obtenerPedidosPorUsuario } from "./caja.js";
import { mostrarMenuCocina } from "./cocina.js";


inicializarDB();
let usuario_admin = null;


function verMenuAdministrador() {
    console.log(`
        ¡BIENVENIDO ADMINISTRADOR DE BIG CAESARS!

        ===============================
        | (1) CAJA                    |
        | (2) COCINA                  |
        | (3) USUARIOS                |
        |                             |
        | [S] SALIR DEL SISTEMA       |
        ===============================
    \n`);
}


function verMenuUsuarios() {
    console.log(`
        ========================================
        | (1) AGREGAR USUARIO                  |
        | (2) VER USUARIOS                     |
        | (3) EDITAR USUARIO                   |
        | (4) ELIMINAR USUARIO                 |
        |                                      |
        | [ANY] REGRESAR AL MENÚ PRINCIPAL     |
        ========================================
    \n`);
}


function verMenuUsuarios2() {
    console.log(`
        =======================================
        | (1) AGREGAR ADMINISTRADOR           |
        | (2) AGREGAR CLIENTE                 |
        |                                     |
        | [ANY] REGRESAR AL MENÚ ANTERIOR     |
        =======================================
    \n`);
}


function verMenuUsuarios3() {
    console.log(`
        =======================================
        | (1) VER ADMINISTRADORES             |
        | (2) VER CLIENTES                    |
        | (3) VER TODOS LOS USUARIOS          |
        |                                     |
        | [ANY] REGRESAR AL MENÚ ANTERIOR     |
        =======================================
    \n`);
}


async function main() {
    try {
        console.clear();
        console.log(`\n
            =======================================
            | INICIO DE SESIÓN DE ADMINISTRADORES |
            =======================================
        `);
        usuario_admin = await logIn();

        if (!usuario_admin.es_admin) {
            console.log("\n========== ESTE USUARIO NO TIENE PERMISOS DE ADMINISTRADOR ==========");
            rl.close();
            return;
        }
        await rl.question("\n[ENTER] PARA ENTRAR AL SISTEMA");
    } catch (e) {
        console.log(`\nERROR: ${e.mensaje || e}`);
        rl.close();
        return;
    }

    let breakpoint = "";
    while (breakpoint.toLowerCase() !== "s") {
        console.clear();
        verMenuAdministrador();
        breakpoint = await rl.question(">>> ");
        
        try {
            switch(breakpoint) {
                case "1":
                    let entradaCaja = "";
                    while(["1", "2"].includes(entradaCaja = await (async () => {
                        console.clear();
                        verMenuCaja();
                        return await rl.question(">>> ");
                    })())) {
                        if (entradaCaja === "1") {
                            console.clear();
                            obtenerTodosLosPedidos();
                            await rl.question("\n[ENTER] PARA CONTINUAR");
                        } else if (entradaCaja === "2") {
                            console.clear();
                            obtenerUsuarios(false);
                            const id_str = await rl.question("\nID DEL CLIENTE A CONSULTAR SUS PEDIDOS\n>>> ");
                            console.clear();
                            obtenerPedidosPorUsuario(parseInt(id_str));
                            await rl.question("\n[ENTER] PARA CONTINUAR");
                        }
                    }
                    break;
                case "2":
                    await mostrarMenuCocina();
                    break;
                case "3":
                    let entradaUsuarios = "";
                    while(["1", "2", "3", "4"].includes(entradaUsuarios = await (async () => {
                        console.clear();
                        verMenuUsuarios();
                        return await rl.question(">>> ");
                    })())) {
                        if (entradaUsuarios === "1") {
                            console.clear(); verMenuUsuarios2();
                            let subOp1 = await rl.question(">>> ");
                            if (subOp1 === "1") { await signUp(true); console.log("========== ADMIN REGISTRADO EXITOSAMENTE =========="); await rl.question(""); }
                            if (subOp1 === "2") { await signUp(false); console.log("========== CLIENTE REGISTRADO EXITOSAMENTE =========="); await rl.question(""); }
                        }
                        else if (entradaUsuarios === "2") {
                            console.clear(); verMenuUsuarios3();
                            let subOp2 = await rl.question(">>> ");
                            console.clear();
                            if (subOp2 === "1") obtenerUsuarios(true);
                            if (subOp2 === "2") obtenerUsuarios(false);
                            if (subOp2 === "3") obtenerUsuarios();
                            await rl.question("\n[ENTER] PARA CONTINUAR");
                        }
                        else if (entradaUsuarios === "3") {
                            console.clear();
                            obtenerUsuarios();
                            await editUser();
                            console.log("========== USUARIO EDITADO EXITOSAMENTE ==========");
                            await rl.question("");
                        }
                        else if (entradaUsuarios === "4") {
                            console.clear();
                            obtenerUsuarios();
                            await deleteUser();
                            console.log("========== USUARIO ELIMINADO EXITOSAMENTE ==========");
                            await rl.question("");
                        }
                    }
                    break;
            }
        } catch (e) {
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
    console.log("\n========== ¡NOS VEMOS ADMINISTRADOR! ==========");
    rl.close();
}


main();