import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Users } from 'lucide-react';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

interface WinningLine {
  positions: number[];
  player: Player;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'draw'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const checkWinner = (currentBoard: Board): WinningLine | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return {
          positions: combination,
          player: currentBoard[a] as Player
        };
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setGameStatus('win');
      setWinner(winResult.player);
      setWinningLine(winResult.positions);
      setScores(prev => ({
        ...prev,
        [winResult.player]: prev[winResult.player] + 1
      }));
    } else if (newBoard.every(cell => cell !== null)) {
      setGameStatus('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
  };

  const getStatusMessage = () => {
    if (gameStatus === 'win') {
      return `Player ${winner} Wins!`;
    }
    if (gameStatus === 'draw') {
      return "It's a Draw!";
    }
    return `Player ${currentPlayer}'s Turn`;
  };

  const getCellContent = (index: number) => {
    const cell = board[index];
    if (!cell) return '';
    return cell;
  };

  const isCellWinning = (index: number) => winningLine.includes(index);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-game-bg to-background">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-win-line" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tic Tac Toe
            </h1>
            <Users className="h-8 w-8 text-win-line" />
          </div>
          
          {/* Score Board */}
          <div className="flex justify-center gap-6 mb-4 p-4 rounded-xl bg-card/50 border border-game-border backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold player-x">{scores.X}</div>
              <div className="text-sm text-muted-foreground">Player X</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{scores.draws}</div>
              <div className="text-sm text-muted-foreground">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold player-o">{scores.O}</div>
              <div className="text-sm text-muted-foreground">Player O</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <div className="text-xl font-semibold text-foreground mb-2">
            {getStatusMessage()}
          </div>
          {gameStatus === 'playing' && (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentPlayer === 'X' ? 'bg-player-x' : 'bg-player-o'} animate-pulse`} />
              <span className="text-muted-foreground">
                {currentPlayer === 'X' ? 'Blue' : 'Orange'} turn
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="game-board rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameStatus !== 'playing' || cell !== null}
                className={`
                  aspect-square rounded-lg bg-game-cell border-2 border-game-border
                  flex items-center justify-center text-5xl font-bold
                  transition-game hover:bg-game-hover disabled:cursor-not-allowed
                  ${!cell && gameStatus === 'playing' ? 'hover:scale-105 hover:shadow-lg' : ''}
                  ${isCellWinning(index) ? 'winning-cell' : ''}
                  ${cell === 'X' ? 'player-x' : cell === 'O' ? 'player-o' : ''}
                `}
              >
                {cell && (
                  <span className="cell-enter">
                    {getCellContent(index)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="gap-2 bg-card/50 border-game-border hover:bg-game-hover transition-game"
          >
            <RotateCcw className="h-5 w-5" />
            New Game
          </Button>
        </div>

        {/* Game Over Overlay */}
        {gameStatus !== 'playing' && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl p-8 text-center border border-game-border shadow-2xl max-w-sm mx-4">
              <div className="mb-4">
                {gameStatus === 'win' ? (
                  <Trophy className="h-16 w-16 mx-auto text-win-line animate-bounce" />
                ) : (
                  <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {gameStatus === 'win' ? (
                  <span className={winner === 'X' ? 'player-x' : 'player-o'}>
                    Player {winner} Wins!
                  </span>
                ) : (
                  "It's a Draw!"
                )}
              </h2>
              <p className="text-muted-foreground mb-6">
                {gameStatus === 'win' ? 'Congratulations!' : 'Good game!'}
              </p>
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;