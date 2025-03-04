import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';

// Generate a random server seed (this would normally be done on the server)
export const generateServerSeed = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a random client seed
export const generateClientSeed = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a hash from the server seed, client seed, and nonce
export const generateHash = (serverSeed: string, clientSeed: string, nonce: number): string => {
  return SHA256(`${serverSeed}:${clientSeed}:${nonce}`).toString(Hex);
};

// Generate a dice roll (1-6) from a hash
export const generateDiceRoll = (hash: string): number => {
  // Take the first 8 characters of the hash and convert to a decimal number
  const decimal = parseInt(hash.substring(0, 8), 16);
  // Get a number between 0 and 5, then add 1 to get a number between 1 and 6
  return (decimal % 6) + 1;
};

// Check if the roll is a win (4, 5, or 6)
export const isWin = (roll: number): boolean => {
  return roll >= 4;
};