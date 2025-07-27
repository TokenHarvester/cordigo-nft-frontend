import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID, NETWORK, MARKETPLACE_SEED, TREASURY_SEED, LISTING_SEED } from './constants';

export const getConnection = () => {
  return new Connection(NETWORK, 'confirmed');
};

// Helper function to derive marketplace PDA
export const getMarketplacePDA = (marketplaceName) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MARKETPLACE_SEED), Buffer.from(marketplaceName)],
    PROGRAM_ID
  );
};

// Helper function to derive treasury PDA
export const getTreasuryPDA = (marketplacePda) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_SEED), marketplacePda.toBuffer()],
    PROGRAM_ID
  );
};

// Helper function to derive listing PDA
export const getListingPDA = (marketplacePda, nftMint) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LISTING_SEED), marketplacePda.toBuffer(), nftMint.toBuffer()],
    PROGRAM_ID
  );
};

// Helper to get associated token account
export const getAssociatedTokenAddress = async (mint, owner) => {
  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return address;
};