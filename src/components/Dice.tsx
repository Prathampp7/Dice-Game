import React from 'react';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const renderDots = () => {
    if (value === null) return null;

    switch (value) {
      case 1:
        return (
          <div className="grid place-items-center h-full w-full">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 h-full w-full p-4">
            <div className="flex justify-start items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-3 grid-rows-3 h-full w-full p-4">
            <div className="flex justify-start items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-2 row-start-2 flex justify-center items-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-3 row-start-3 flex justify-end items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-4">
            <div className="flex justify-start items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-start items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 grid-rows-3 h-full w-full p-4">
            <div className="flex justify-start items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-3 row-start-1 flex justify-end items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-2 row-start-2 flex justify-center items-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-1 row-start-3 flex justify-start items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="col-start-3 row-start-3 flex justify-end items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-2 grid-rows-3 h-full w-full p-4">
            <div className="flex justify-start items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-start">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-start items-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-start items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-end items-end">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-24 h-24 bg-gray-800 rounded-lg border-2 border-gray-700 shadow-lg ${
        isRolling ? 'animate-bounce' : ''
      } ${value && value >= 4 ? 'border-green-500' : value ? 'border-red-500' : ''}`}
    >
      {renderDots()}
    </div>
  );
};

export default Dice;