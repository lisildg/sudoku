
import React, { useState, useEffect } from "react";

export default function Home() {
  const N = 9; // Tamaño de la cuadrícula 9x9
  const initialGrid = new Array(N).fill(null).map(() => new Array(N).fill(0));
  const [sudokuGrid, setSudokuGrid] = useState(initialGrid);

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

  return (
    <div>
      <section className=" text-center bg-red-600">
    <table  className="sudoku-grid border-collapse border border-black m-auto">
      <tbody  className="text-center">
        {sudokuGrid.map((row, rowIndex) => (
          <tr  key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                className={` border border-black w-10 h-10 text-center ${
                  cell === 0 ? "bg-white" : ""
                }`}
              >
                {cell === 0 ? "" : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </section>
    </div>

);
}
