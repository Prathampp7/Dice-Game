import React from 'react';
import { PreviousRoll } from '../types';
import { Dice1 as Dice } from 'lucide-react';

interface DiceLineProps {
  previousRolls: PreviousRoll[];
}

const DiceLine: React.FC<DiceLineProps> = ({ previousRolls }) => {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex space-x-4 min-w-max">
        {previousRolls.length === 0 ? (
          <div className="flex items-center justify-center text-gray-500">
            <Dice className="mr-2" />
            <span>No previous rolls</span>
          </div>
        ) : (
          previousRolls.map((roll, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center p-2 rounded-md ${
                roll.won ? 'bg-green-900/30' : 'bg-red-900/30'
              }`}
              title={`Hash: ${roll.hash}`}
            >
              <div className="text-lg font-bold">{roll.diceValue}</div>
              <div className="text-sm">${roll.betAmount}</div>
              <div className="text-xs text-gray-400">#{roll.nonce}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiceLine;