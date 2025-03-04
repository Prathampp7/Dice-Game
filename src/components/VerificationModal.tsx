import React from 'react';
import { PreviousRoll } from '../types';
import { X } from 'lucide-react';

interface VerificationModalProps {
  roll: PreviousRoll;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ roll, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Verify Roll #{roll.nonce}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-400 text-sm">Result</h3>
            <p className="text-lg font-bold">
              Dice: {roll.diceValue} ({roll.won ? 'Win' : 'Loss'})
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm">Server Seed (Hashed before game)</h3>
            <p className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
              {roll.serverSeed}
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm">Client Seed</h3>
            <p className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
              {roll.clientSeed}
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm">Nonce</h3>
            <p className="bg-gray-900 p-2 rounded text-xs">
              {roll.nonce}
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm">Result Hash</h3>
            <p className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
              {roll.hash}
            </p>
          </div>
          
          <div className="text-sm text-gray-400 mt-4">
            <p>To verify this roll:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Combine the server seed, client seed, and nonce with ":" between them</li>
              <li>Generate a SHA-256 hash of this combined string</li>
              <li>Take the first 8 characters of the hash and convert to decimal</li>
              <li>Calculate (decimal % 6) + 1 to get the dice roll (1-6)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;