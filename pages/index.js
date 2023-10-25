import React, { useState, useEffect } from "react";

export default function Home() {
  const N = 9; // Tamaño de la cuadrícula 9x9
  const initialGrid = new Array(N).fill(null).map(() => new Array(N).fill(0));
  const [sudokuGrid, setSudokuGrid] = useState(initialGrid);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Función para verificar si un número es válido en una celda
    function isValid(num, row, col) {
      for (let i = 0; i < N; i++) {
        if (sudokuGrid[row][i] === num) return false;
      }

      // Verificar columna
      for (let i = 0; i < N; i++) {
        if (sudokuGrid[i][col] === num) return false;
      }

      // Verificar subcuadrícula 3x3
      const subgridRow = Math.floor(row / 3) * 3;
      const subgridCol = Math.floor(col / 3) * 3;
      for (let i = subgridRow; i < subgridRow + 3; i++) {
        for (let j = subgridCol; j < subgridCol + 3; j++) {
          if (sudokuGrid[i][j] === num) return false;
        }
      }

      return true;
      
    }

    // Función para resolver Sudoku mediante backtracking
function solveSudoku(row, col) {
  if (row === N - 1 && col === N) return true;
  if (col === N) {
    row++;
    col = 0;
  }

  if (sudokuGrid[row][col] !== 0) {
    return solveSudoku(row, col + 1);
  }

  for (let num = 1; num <= N; num++) {
    if (isValid(num, row, col)) {
      sudokuGrid[row][col] = num;

      if (solveSudoku(row, col + 1)) {
        return true;
      }

      sudokuGrid[row][col] = 0;
    }
  }

  return false;
}

    function generateSudoku() {
      const grid = JSON.parse(JSON.stringify(initialGrid));
      solveSudoku(0, 0, grid);
      
      // Clear some cells to create spaces for the player
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (Math.random() < 0.6) {
            grid[i][j] = 0;
          }
        }
      }

      setSudokuGrid(grid);
    }

    generateSudoku();
  }, []);

  function handleCellClick(row, col) {
    if (sudokuGrid[row][col] === 0) {
      const newGrid = [...sudokuGrid];
      newGrid[row][col] = selectedNumber;
      setSudokuGrid(newGrid);
    }
  }

  function checkCompleted(grid) {
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (grid[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  // // Función para comprobar errores en la cuadrícula
  // function checkErrors() {
  //   let errorCount = 0;
  //   for (let row = 0; row < N; row++) {
  //     for (let col = 0; col < N; col++) {
  //       if (sudokuGrid[row][col] !== 0 && sudokuGrid[row][col] !== solveSudoku(sudokuGrid)) {
  //         errorCount++;
  //       }
  //     }
  //   }
  //   setErrors(errorCount);
  // }

  // Función para comprobar la respuesta y mostrar el mensaje
  function handleCheckAnswer() {
    checkErrors();
    if (errors === 0 && checkCompleted(sudokuGrid)) {
      setIsCompleted(true);
    }
  }

  return (
    <div className=" bg-indigo-600">
    <section className="text-center flex-center ">
      <table className="sudoku-grid  border-collapse border border-black m-auto">
        <tbody className="text-center  bg-indigo-400">
          {sudokuGrid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border border-black w-10 h-10 text-center ${
                    cell === 0 ? "bg-white" : ""
                  } ${
                    // Agregar clases de borde según la posición
                    rowIndex % 3 === 2 ? "border-b-2" : ""
                  } ${
                    colIndex % 3 === 2 ? "border-r-2" : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell === 0 ? "" : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <div className="text-center mt-4">
        <div>
          <span>Selecciona un número: </span>
          <div>
        {/* Mapear un conjunto de botones para elegir el número */}
        {Array.from({ length: N }, (_, i) => (
          <button
            key={i}
            className="btn-number"
            onClick={() => setSelectedNumber(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {/* Agregar un botón para borrar */}
        <button
          key={0}
          className="btn-number"
          onClick={() => setSelectedNumber(0)}
        >
          Borrar
        </button>
      </div> 
        </div>
        {/* <button onClick={handleCheckAnswer}>Comprobar Respuesta</button> */}
        {isCompleted && <p>¡Completado correctamente!</p>}
        {errors > 0 && <p>Errores encontrados: {errors}</p>}
      </div>
    </div>
  );
}
