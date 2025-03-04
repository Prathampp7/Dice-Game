export interface GameState {
  balance: number;
  betAmount: number;
  diceValue: number | null;
  isRolling: boolean;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  previousRolls: PreviousRoll[];
  lastHash: string;
}

export interface PreviousRoll {
  diceValue: number;
  betAmount: number;
  won: boolean;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  hash: string;
}