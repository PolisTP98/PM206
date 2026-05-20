import readline from 'readline';

// Interfaz de entrada y salida
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// BD
export let inventario = [
  {
    id: 1,
    nombre: "Pizza Clasica de Pepperoni",
    categoria: "Pizza",
    precio: 99.00,
    ingredientes: ["Masa original", "Salsa de tomate", "Queso", "Pepperoni"]
  },
  {
    id: 2,
    nombre: "Pizza de Queso",
    categoria: "Pizza",
    precio: 89.00,
    ingredientes: ["Masa original", "Salsa de tomate", "Extra queso"]
  },
  {
    id: 3,
    nombre: "Crazy Bread",
    categoria: "Complemento",
    precio: 49.00,
    ingredientes: ["Masa original", "Mantequilla de ajo", "Queso parmesano"]
  }
];

// Contador para generar IDs
let proximoId = 4;

// Funcion para agregar un producto
function agregarProducto(nombre, categoria, precio, ingredientes) {
  const nuevoProducto = {
    id: proximoId,
    nombre: nombre,
    categoria: categoria,
    precio: precio,
    ingredientes: ingredientes 
  };
  
  inventario.push(nuevoProducto);
  proximoId++; 
  console.log(`Producto agregado exitosamente: ${nombre}`);
}

// Funcion para listar los productos
function listarProductos() {
  console.log("\n--- MENU DE LITTLE CAESARS ---");
  
  inventario.forEach(producto => {
    console.log(`[ID: ${producto.id}] ${producto.nombre} - $${producto.precio} (${producto.categoria})`);
    
    if (producto.ingredientes && producto.ingredientes.length > 0) {
      console.log(`   Ingredientes: ${producto.ingredientes.join(", ")}`);
    }
  });
  console.log("------------------------------------\n");
}

// Funcion para editar el producto
function actualizarProducto(id, nuevosDatos) {
  const indice = inventario.findIndex(producto => producto.id === id);
  
  if (indice !== -1) {
    inventario[indice] = { ...inventario[indice], ...nuevosDatos };
    console.log(`Producto con ID ${id} actualizado correctamente.`);
  } else {
    console.log(`Error: No se encontro el producto con ID ${id}.`);
  }
}

// Funcion para eliminar un producto
function eliminarProducto(id) {
  const longitudInicial = inventario.length;
  inventario = inventario.filter(producto => producto.id !== id); 
  
  if (inventario.length < longitudInicial) {
    console.log(`Producto con ID ${id} eliminado de la cocina.`);
  } else {
    console.log(`Error: No se encontro el producto con ID ${id}.`);
  }
}

// Funcion del menu interactivo
function mostrarMenu() {
  console.log("\n--- SISTEMA DE GESTION DE COCINA ---");
  console.log("1. Ver el menu de productos");
  console.log("2. Agregar un producto nuevo");
  console.log("3. Editar un producto");
  console.log("4. Eliminar un producto");
  console.log("5. Salir del sistema");
  
  rl.question("\nElige una opcion (1-5): ", (opcion) => {
    switch (opcion.trim()) {
      case '1':
        listarProductos();
        mostrarMenu();
        break;
        
      case '2':
        rl.question("Nombre del producto: ", (nombre) => {
          rl.question("Categoria (Ej. Pizza, Complemento): ", (categoria) => {
            rl.question("Precio: ", (precioStr) => {
              rl.question("Ingredientes (separados por coma): ", (ingredientesStr) => {
                const precio = parseFloat(precioStr);
                const ingredientes = ingredientesStr.split(',').map(ingrediente => ingrediente.trim());
                agregarProducto(nombre, categoria, precio, ingredientes);
                mostrarMenu();
              });
            });
          });
        });
        break;
        
      case '3':
        listarProductos();
        rl.question("Ingresa el ID del producto que deseas editar: ", (idStr) => {
          const id = parseInt(idStr);
          const productoActual = inventario.find(p => p.id === id);

          if (!productoActual) {
            console.log(`Error: No se encontro el producto con ID ${id}.`);
            return mostrarMenu();
          }

          console.log("\n[NOTA: Deja en blanco y presiona Enter para mantener el valor actual]");
          
          rl.question(`Nombre (${productoActual.nombre}): `, (nombre) => {
            rl.question(`Categoria (${productoActual.categoria}): `, (categoria) => {
              rl.question(`Precio ($${productoActual.precio}): `, (precioStr) => {
                rl.question(`Ingredientes (${productoActual.ingredientes.join(', ')}): `, (ingredientesStr) => {
                  
                  const nuevosDatos = {};

                  if (nombre.trim() !== "") nuevosDatos.nombre = nombre.trim();
                  if (categoria.trim() !== "") nuevosDatos.categoria = categoria.trim();
                  
                  if (precioStr.trim() !== "") {
                    const precioActualizado = parseFloat(precioStr);
                    if (!isNaN(precioActualizado)) nuevosDatos.precio = precioActualizado;
                  }
                  
                  if (ingredientesStr.trim() !== "") {
                    nuevosDatos.ingredientes = ingredientesStr.split(',').map(i => i.trim());
                  }

                  if (Object.keys(nuevosDatos).length > 0) {
                    actualizarProducto(id, nuevosDatos);
                  } else {
                    console.log("No se realizo ningun cambio.");
                  }
                  
                  mostrarMenu();
                });
              });
            });
          });
        });
        break;
        
      case '4':
        listarProductos();
        rl.question("Ingresa el ID del producto que deseas eliminar: ", (idStr) => {
          const id = parseInt(idStr);
          eliminarProducto(id);
          mostrarMenu();
        });
        break;
        
      case '5':
        console.log("Cerrando el sistema. Hasta luego.");
        rl.close();
        break;
        
      default:
        console.log("Opcion no valida. Por favor, intenta de nuevo.");
        mostrarMenu();
        break;
    }
  });
}

// Iniciar la aplicacion mostrando el menu
mostrarMenu();