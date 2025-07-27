import { PublicKey } from '@solana/web3.js';

// Your actual Program ID from entrypoint.rs
export const PROGRAM_ID = new PublicKey('LdAWh3nDWt1repA9UVDeiMQifkFDoqSfoikNPe3zpnt');

// Solana network (use devnet for testing)
export const NETWORK = 'https://api.devnet.solana.com';

// Seeds for PDAs (Program Derived Addresses)
export const MARKETPLACE_SEED = 'marketplace';
export const TREASURY_SEED = 'treasury';
export const LISTING_SEED = 'listing';

// Default values
export const DEFAULT_MARKETPLACE_NAME = 'codigo-market';
export const MAX_FEE_BASIS_POINTS = 10000; // 100%