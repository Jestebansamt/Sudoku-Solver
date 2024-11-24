
let posibles = [];
let ceros = [];
let sudoku = [];



document.addEventListener('DOMContentLoaded', function () {

    // Crear las casillas en sudokuGrid con su respectiva clase
    const sudokuGrid = document.getElementById("sudoku-grid");
    
    for (let fil = 0; fil < 9; fil++) {
        const nuevaFil = document.createElement("tr");

        for (let col = 0; col < 9; col++) {
            const casilla = document.createElement("td");
            const input = document.createElement("input");
           
            input.className = "casilla";
            input.type = "number";
    
            casilla.appendChild(input);
            nuevaFil.appendChild(casilla);
        }
        sudokuGrid.appendChild(nuevaFil);
    }

    // Al oprimir el boton se llama la funcion encargada de solucionar el sudoku
    const solucionBtn = document.getElementById("solucion");
    solucionBtn.addEventListener('click', () => solucion());
});

function solucion() {
   
    // Traemos los valores del usuario y se organizan en un arreglo bidimensional
    const sudokuArreglo = document.querySelectorAll(".casilla");
    let k = 0;

    for(let i = 0; i < 9; i++){
        const tempFil = [];

        for(let j = 0; j < 9; j++){
            tempFil.push(sudokuArreglo[k]);
            k++
        }
        sudoku.push(tempFil);
    }

    // Buscamos todas las posibles soluciones de cada cero para optimizar
    buscarPosibles();
    // Encontramos las coordenadas los ceros para no tener que recorrer todo el tablero
    encontrarCeros();
    // Solucionamos el sudoku comenzando desde la casilla 0 probando todos los posibles
    backtraking(0);

}

function buscarPosibles() {

    for (let fil = 0; fil < 9; fil++) {
        for (let col = 0; col < 9; col++) {

            if (sudoku[fil][col].value == 0) {

                let pos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                // Eliminar elementos en la misma fila y columna
                for (let i = 0; i < 9; i++) {
                    pos = pos.filter(num => sudoku[fil][i].value !== num && sudoku[i][col].value !== num);
                }

                // Eliminar elementos en la misma subcuadrícula 3x3
                const inicioFil = Math.floor(fil / 3) * 3;
                const inicioCol = Math.floor(col / 3) * 3;

                for (let i = inicioFil; i < inicioFil + 3; i++) {
                    for (let j = inicioCol; j < inicioCol + 3; j++) {
                        pos = pos.filter(num => sudoku[i][j].value !== num);
                    }
                }
                posibles.push(pos);

            }
        }
    }
}

function encontrarCeros() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudoku[i][j].value == 0) {
                ceros.push([i, j]);
            }
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let haySolucion = false;
function backtraking(indice) {

    // Retornar si hay solucion
    if (haySolucion) return;

    // Verificar que ya se haya encontrado una solucion

    if (indice == posibles.length) {
        haySolucion = true;
        return;
    }

    // Recorrer cada posibilidad segun las coordenadas de los ceros
    let [fil, col] = ceros[indice];
    for (const num of posibles[indice]) {
         
        if (esValido(fil, col, num)) {
            
            sudoku[fil][col].value = num;
            sudoku[fil][col].classList.add("solucionado");        
            
            backtraking(indice + 1);

            // Retroceder para probar el siguiente valor si no hay solucion
            if (haySolucion == false){
                sudoku[fil][col].value = '';  
                sudoku[fil][col].classList.remove("solucionado");   
            }
        }
    }
}

function esValido(fil, col, num) {

    // Verificar fila y columna
    for (let i = 0; i < 9; i++) {
        if (sudoku[fil][i].value == num || sudoku[i][col].value == num) {
            return false;
        }
    }

    // Verificar subcuadrícula 3x3
    const inicioFil = Math.floor(fil / 3) * 3;
    const inicioCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (num == sudoku[inicioFil + i][inicioCol + j].value) {
                return false;
            }
        }
    }

    return true;
}