import React, { useState } from 'react'
import { XorO } from './types'

export const Main = () => {
  const [board, setBoard] = useState<(XorO | undefined)[][]>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
  ])

  const resetGame = () => {
    setBoard([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ])
    setCurrentPlayer('X')
    setWinner(undefined)
    setIsGameOver(false)
  }  

  // Add a states to track current player, if there is a winner, and if game is over
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X')
  const [winner, setWinner] = useState<XorO | undefined>(undefined)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)

  // Function to handle clicks on the play board
  const handleClick = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex] !== undefined) return

    // `Use map function to create new board with X or O in the clicked cell`
    const newBoard = board.map((row, rIdx) =>
      row.map((col, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return currentPlayer
        }
        return col
      })
    )

    // Update board matrix and check for a winner or game over, else switch turn to next player
    setBoard(newBoard)
    if (checkWinner(newBoard, currentPlayer)) {
      setWinner(currentPlayer)
    } else if (isBoardFull(newBoard)) {
      setIsGameOver(true)
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  // Function to check if there is a winner
  const checkWinner = (board: (XorO | undefined)[][], player: XorO): boolean => {
    const winPatterns = [
      [ [0, 0], [0, 1], [0, 2] ], // Top line
      [ [1, 0], [1, 1], [1, 2] ], // Middle line
      [ [2, 0], [2, 1], [2, 2] ], // Bottom line
      [ [0, 0], [1, 0], [2, 0] ], // Left column
      [ [0, 1], [1, 1], [2, 1] ], // Middle column
      [ [0, 2], [1, 2], [2, 2] ], // Right column
      [ [0, 0], [1, 1], [2, 2] ], // Right diagonal
      [ [0, 2], [1, 1], [2, 0] ] // Left diagonal
    ]
    // Perform pattern match to check if either player has a row of three
    return winPatterns.some(pattern =>
      pattern.every(([r, c]) => board[r][c] === player)
    )
  }

  // Function to check if the board is full 
  const isBoardFull = (board: (XorO | undefined)[][]): boolean => {
    return board.every(row => row.every(cell => cell !== undefined))
  }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-customGreen p-4'>
      <div className='font-serif font-bold text-3xl mb-6 text-white'>Tic Tac Toe</div>
      {winner || isGameOver ? (
        <div className='flex flex-col items-center gap-4'>
          {winner ? (
            <div className='text-2xl font-bold text-green-200'>
              Player {winner} wins!
            </div>
          ) : (
            <div className='text-2xl font-bold text-red-200'>
              Game Over!
            </div>
          )}
          <button
            onClick={resetGame}
            className='mt-4 px-4 py-2 bg-customLightGreen hover:bg-green-700 text-black font-bold rounded'
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-1'>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className='flex gap-1'>
              {row.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className='border-2 border-gray-900 w-16 h-16 cursor-pointer items-center justify-center text-2xl font-bold flex bg-white hover:bg-gray-200'
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {column}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
