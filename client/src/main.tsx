import React, { useState } from 'react'
import { XorO } from './types'

export const Main = () => {
  // States to track the board, its size, current player, if there's a winner and if game over
  const [boardSize, setBoardSize] = useState<number>(3)
  const [board, setBoard] = useState<(XorO | undefined)[][]>(generateBoard(3))
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X')
  const [winner, setWinner] = useState<XorO | undefined>(undefined)
  const [isGameOver, setIsGameOver] = useState<boolean>(false)

  // Use map function to generate board of given size
  function generateBoard(size: number): (XorO | undefined)[][] {
    return Array(size).fill(null).map(() => Array(size).fill(undefined))
  }

  // Update states for game reset
  const resetGame = () => {
    setBoard(generateBoard(boardSize))
    setCurrentPlayer('X')
    setWinner(undefined)
    setIsGameOver(false)
  }

  // Create new board and reset states when size of board is changed
  const handleBoardSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value, 10)
    setBoardSize(newSize)
    setBoard(generateBoard(newSize))
    setWinner(undefined)
    setIsGameOver(false)
  }


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
    const winPatterns = generateWinPatterns(boardSize)
    return winPatterns.some(pattern =>
      pattern.every(([r, c]) => board[r][c] === player)
    )
  }

  // Dynamically generate the patterns which would mean a player has won
  function generateWinPatterns(size: number): [number, number][][] {
    const patterns: [number, number][][] = []
    for (let i = 0; i < size; i++) {
      patterns.push([...Array(size)].map((_, j) => [i, j])) // Rows
      patterns.push([...Array(size)].map((_, j) => [j, i])) // Columns
    }
    patterns.push([...Array(size)].map((_, i) => [i, i])) // Right diagonal
    patterns.push([...Array(size)].map((_, i) => [i, size - 1 - i])) // Left diagonal
    return patterns
  }

  // Function to check if the board is full 
  const isBoardFull = (board: (XorO | undefined)[][]): boolean => {
    return board.every(row => row.every(cell => cell !== undefined))
  }

  // Function to check if the board is empty
  const isBoardEmpty = (): boolean => {
    return board.every(row => row.every(cell => cell === undefined))
  }


  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-customGreen p-4'>
      <div className='font-serif font-bold text-3xl mb-6 text-white'>Tic Tac Toe</div>
      <div className='mb-4'>
        <label htmlFor='boardSize' className='text-white mr-2'>Select board size:</label>
        <select
          id='boardSize'
          value={boardSize}
          onChange={handleBoardSizeChange}
          className={`p-2 rounded ${isBoardEmpty() ? 'bg-white text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!isBoardEmpty()}
        >
          {[...Array(13)].map((_, index) => (
            <option key={index} value={index + 3}>{index + 3}x{index + 3}</option>
          ))}
        </select>
      </div>
      {winner || isGameOver ? (
        <div className='flex flex-col items-center gap-4'>
          {winner ? (
            <div className='text-2xl font-bold text-customLightGreen'>
              Player {winner} wins!
            </div>
          ) : (
            <div className='text-2xl font-bold text-customRed'>
              Game Over!
            </div>
          )}
          <button
            onClick={resetGame}
            className='mt-4 px-4 py-2 bg-customLightGreen hover:bg-green-700 text-white font-bold rounded'
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
