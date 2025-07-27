import { TransactionInstruction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as borsh from 'borsh';
import { PROGRAM_ID } from './constants';
import {
  getMarketplacePDA,
  getTreasuryPDA,
  getListingPDA,
  getAssociatedTokenAddress,
} from './program';

// Instruction schemas based on your instruction.rs
const InstructionSchema = new Map([
  [
    'InitializeMarketplace',
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['name', 'string'],
        ['fee', 'u16'],
      ],
    },
  ],
  [
    'ListNFT',
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['price', 'u64'],
        ['listing_bump', 'u8'],
      ],
    },
  ],
  [
    'DelistNFT',
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['listing_bump', 'u8'],
      ],
    },
  ],
  [
    'PurchaseNFT',
    {
      kind: 'struct',
      fields: [['instruction', 'u8']],
    },
  ],
  [
    'UpdateFee',
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['updated_fee', 'u16'],
      ],
    },
  ],
]);

// Create Initialize Marketplace instruction
export const createInitializeMarketplaceInstruction = async (
  admin,
  marketplaceName,
  fee
) => {
  const [marketplacePda, marketplaceBump] = getMarketplacePDA(marketplaceName);
  const [treasuryPda, treasuryBump] = getTreasuryPDA(marketplacePda);

  const data = borsh.serialize(InstructionSchema.get('InitializeMarketplace'), {
    instruction: 0, // InitializeMarketplace variant
    name: marketplaceName,
    fee: fee,
  });

  const accounts = [
    { pubkey: admin, isSigner: true, isWritable: true },
    { pubkey: marketplacePda, isSigner: false, isWritable: true },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys: accounts,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
};

// Create List NFT instruction
export const createListNFTInstruction = async (
  seller,
  marketplaceName,
  nftMint,
  price
) => {
  const [marketplacePda] = getMarketplacePDA(marketplaceName);
  const [listingPda, listingBump] = getListingPDA(marketplacePda, nftMint);
  const sellerTokenAccount = await getAssociatedTokenAddress(nftMint, seller);
  const vaultTokenAccount = await getAssociatedTokenAddress(nftMint, listingPda);

  const data = borsh.serialize(InstructionSchema.get('ListNFT'), {
    instruction: 1, // ListNFT variant
    price: price.toString(),
    listing_bump: listingBump,
  });

  const accounts = [
    { pubkey: seller, isSigner: true, isWritable: true },
    { pubkey: marketplacePda, isSigner: false, isWritable: false },
    { pubkey: listingPda, isSigner: false, isWritable: true },
    { pubkey: nftMint, isSigner: false, isWritable: false },
    { pubkey: sellerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys: accounts,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
};

// Create Delist NFT instruction
export const createDelistNFTInstruction = async (
  seller,
  marketplaceName,
  nftMint
) => {
  const [marketplacePda] = getMarketplacePDA(marketplaceName);
  const [listingPda, listingBump] = getListingPDA(marketplacePda, nftMint);
  const sellerTokenAccount = await getAssociatedTokenAddress(nftMint, seller);
  const vaultTokenAccount = await getAssociatedTokenAddress(nftMint, listingPda);

  const data = borsh.serialize(InstructionSchema.get('DelistNFT'), {
    instruction: 2, // DelistNFT variant
    listing_bump: listingBump,
  });

  const accounts = [
    { pubkey: seller, isSigner: true, isWritable: true },
    { pubkey: marketplacePda, isSigner: false, isWritable: false },
    { pubkey: listingPda, isSigner: false, isWritable: true },
    { pubkey: nftMint, isSigner: false, isWritable: false },
    { pubkey: sellerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys: accounts,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
};

// Create Purchase NFT instruction
export const createPurchaseNFTInstruction = async (
  buyer,
  seller,
  marketplaceName,
  nftMint
) => {
  const [marketplacePda] = getMarketplacePDA(marketplaceName);
  const [treasuryPda] = getTreasuryPDA(marketplacePda);
  const [listingPda] = getListingPDA(marketplacePda, nftMint);
  const buyerTokenAccount = await getAssociatedTokenAddress(nftMint, buyer);
  const vaultTokenAccount = await getAssociatedTokenAddress(nftMint, listingPda);

  const data = borsh.serialize(InstructionSchema.get('PurchaseNFT'), {
    instruction: 3, // PurchaseNFT variant
  });

  const accounts = [
    { pubkey: buyer, isSigner: true, isWritable: true },
    { pubkey: seller, isSigner: false, isWritable: true },
    { pubkey: marketplacePda, isSigner: false, isWritable: false },
    { pubkey: treasuryPda, isSigner: false, isWritable: true },
    { pubkey: listingPda, isSigner: false, isWritable: true },
    { pubkey: nftMint, isSigner: false, isWritable: false },
    { pubkey: buyerTokenAccount, isSigner: false, isWritable: true },
    { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys: accounts,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
};

// Create Update Fee instruction
export const createUpdateFeeInstruction = async (
  admin,
  marketplaceName,
  updatedFee
) => {
  const [marketplacePda] = getMarketplacePDA(marketplaceName);

  const data = borsh.serialize(InstructionSchema.get('UpdateFee'), {
    instruction: 4, // UpdateFee variant
    updated_fee: updatedFee,
  });

  const accounts = [
    { pubkey: admin, isSigner: true, isWritable: true },
    { pubkey: marketplacePda, isSigner: false, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys: accounts,
    programId: PROGRAM_ID,
    data: Buffer.from(data),
  });
};