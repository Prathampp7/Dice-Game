import React, { useState, useEffect } from 'react';
import { Dice1 as DiceIcon, RefreshCw, Info } from 'lucide-react';
import Dice from './components/Dice';
import DiceLine from './components/DiceLine';
import VerificationModal from './components/VerificationModal';
import { GameState, PreviousRoll } from './types';
import { 
  generateServerSeed, 
  generateClientSeed, 
  generateHash, 
  generateDiceRoll, 
  isWin 
} from './utils/provablyFair';

const INITIAL_BALANCE = 1000;
const LOCAL_STORAGE_KEY = 'provablyFairDiceGame';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      balance: INITIAL_BALANCE,
      betAmount: 10,
      diceValue: null,
      isRolling: false,
      serverSeed: generateServerSeed(),
      clientSeed: generateClientSeed(),
      nonce: 0,
      previousRolls: [],
      lastHash: ''
    };
  });

  const [selectedRoll, setSelectedRoll] = useState<PreviousRoll | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setGameState(prev => ({ ...prev, betAmount: value }));
    }
  };

  const handleMaxBet = () => {
    setGameState(prev => ({ ...prev, betAmount: prev.balance }));
  };

  const handleHalfBet = () => {
    setGameState(prev => ({ ...prev, betAmount: Math.floor(prev.balance / 2) }));
  };

  const handleResetBalance = () => {
    if (window.confirm('Are you sure you want to reset your balance to $1000?')) {
      setGameState(prev => ({ 
        ...prev, 
        balance: INITIAL_BALANCE,
        previousRolls: []
      }));
    }
  };

  const handleRollDice = () => {
    // Validate bet amount
    if (gameState.betAmount <= 0 || gameState.betAmount > gameState.balance) {
      alert('Invalid bet amount');
      return;
    }

    // Start rolling animation
    setGameState(prev => ({ ...prev, isRolling: true, diceValue: null }));

    // Simulate server delay
    setTimeout(() => {
      const { serverSeed, clientSeed, nonce } = gameState;
      
      // Generate hash and roll
      const hash = generateHash(serverSeed, clientSeed, nonce);
      const roll = generateDiceRoll(hash);
      const won = isWin(roll);
      
      // Calculate new balance
      const balanceChange = won ? gameState.betAmount : -gameState.betAmount;
      const newBalance = gameState.balance + balanceChange;
      
      // Create record of this roll
      const rollRecord: PreviousRoll = {
        diceValue: roll,
        betAmount: gameState.betAmount,
        won,
        serverSeed,
        clientSeed,
        nonce,
        hash
      };
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        balance: newBalance,
        diceValue: roll,
        isRolling: false,
        nonce: prev.nonce + 1,
        previousRolls: [rollRecord, ...prev.previousRolls].slice(0, 10),
        lastHash: hash
      }));
      
    }, 1000);
  };

  const handleNewSeeds = () => {
    setGameState(prev => ({
      ...prev,
      serverSeed: generateServerSeed(),
      clientSeed: generateClientSeed(),
      nonce: 0
    }));
  };

  const handleVerifyRoll = (roll: PreviousRoll) => {
    setSelectedRoll(roll);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <DiceIcon className="mr-2 text-green-500" size={24} />
            <h1 className="text-xl font-bold">Provably Fair Dice Game</h1>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-gray-700"
            title="How it works"
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-4 max-w-4xl">
        {showInfo && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
            <h2 className="text-lg font-bold mb-2">How Provably Fair Works</h2>
            <p className="mb-2">This game uses a provably fair algorithm to ensure that rolls cannot be manipulated:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-4">
              <li>The server generates a random server seed for each game session</li>
              <li>You get a random client seed (you can change it anytime)</li>
              <li>Each roll uses a combination of both seeds plus a nonce (roll number)</li>
              <li>The result is determined by a SHA-256 hash of these values</li>
              <li>You can verify any roll by clicking on it in the history</li>
            </ol>
            <p className="text-sm text-gray-400">
              Rolls 4-6 win (2x payout), rolls 1-3 lose.
            </p>
            <button 
              onClick={() => setShowInfo(false)}
              className="mt-2 text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Roll the Dice</h2>
                <div className="text-xl font-bold text-green-500">
                  ${gameState.balance.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col items-center mb-6">
                <Dice value={gameState.diceValue} isRolling={gameState.isRolling} />
                
                {gameState.diceValue !== null && (
                  <div className={`mt-4 text-lg font-bold ${gameState.diceValue >= 4 ? 'text-green-500' : 'text-red-500'}`}>
                    {gameState.diceValue >= 4 ? 'You Win!' : 'You Lose!'}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bet Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={gameState.betAmount}
                    onChange={handleBetChange}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max={gameState.balance}
                  />
                  <button
                    onClick={handleHalfBet}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                  >
                    1/2
                  </button>
                  <button
                    onClick={handleMaxBet}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                  >
                    Max
                  </button>
                </div>
              </div>

              <button
                onClick={handleRollDice}
                disabled={gameState.isRolling || gameState.balance <= 0 || gameState.betAmount > gameState.balance}
                className={`w-full py-3 rounded-lg font-bold text-lg mb-4 ${
                  gameState.isRolling || gameState.balance <= 0 || gameState.betAmount > gameState.balance
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {gameState.isRolling ? 'Rolling...' : 'Roll Dice'}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResetBalance}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Reset Balance
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Provably Fair</h2>
                <button
                  onClick={handleNewSeeds}
                  className="text-gray-400 hover:text-white"
                  title="Generate new seeds"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Client Seed
                  </label>
                  <input
                    type="text"
                    value={gameState.clientSeed}
                    onChange={(e) => setGameState(prev => ({ ...prev, clientSeed: e.target.value }))}
                    className="bg-gray-700 text-white px-3 py-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nonce
                  </label>
                  <div className="bg-gray-700 text-white px-3 py-2 rounded w-full text-sm">
                    {gameState.nonce}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Server Seed (Hidden)
                  </label>
                  <div className="bg-gray-700 text-white px-3 py-2 rounded w-full text-sm">
                    {gameState.serverSeed.substring(0, 8)}...
                  </div>
                </div>

                {gameState.lastHash && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Last Hash
                    </label>
                    <div className="bg-gray-700 text-white px-3 py-2 rounded w-full text-xs overflow-hidden text-ellipsis">
                      {gameState.lastHash}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Roll History</h2>
          <DiceLine previousRolls={gameState.previousRolls} />
          
          {gameState.previousRolls.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => handleVerifyRoll(gameState.previousRolls[0])}
                className="text-sm text-green-500 hover:text-green-400"
              >
                Verify Latest Roll
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
        <p>Provably Fair Dice Game &copy; 2025</p>
      </footer>

      {selectedRoll && (
        <VerificationModal 
          roll={selectedRoll} 
          onClose={() => setSelectedRoll(null)} 
        />
      )}
    </div>
  );
}

export default App;