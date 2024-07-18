import React, { useState } from 'react'
import { XorO } from './types'

export const Main = () => {
  const [board, setBoard] = useState<(XorO | undefined)[][]>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
  ])

  // Add a state to track the current player (X or O)
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X')

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
    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  return (
    <div className='flex flex-col mt-10 items-center gap-10'>
      <div className='font-bold text-2xl'>Tic Tac Toe</div>
      <div className='flex flex-col gap-1'>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className='flex gap-1'>
            {row.map((column, colIndex) => (
              <div
                key={colIndex}
                className='border-2 border-gray-900 w-10 h-10 cursor-pointer items-center justify-center text-2xl font-bold flex'
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {column}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
