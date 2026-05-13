console.log("¡Hola mundo JavaScript desde el servidor!")

/* Operaciones */
let edad1 = 11
const edad2 = 42

console.log("Edad promedio")
console.log(edad1 + edad2 / 2)

/* Medir tiempo de un proceso */
console.time("miProceso")
let limite = 10000000000
    for(let i = 0; i < limite; i++) {
        console.log(i)
        console.log((i * 100 / limite) * 100 + "%")
        console.clear()
    }

console.timeEnd("miProceso")

/* Objetos de tipo tabla */
let usuarios = [
    {nombre: "Isaac", edad: 20}, 
    {nombre: "Daniela", edad: 21}
]
console.table(usuarios)