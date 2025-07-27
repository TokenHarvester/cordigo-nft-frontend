import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from '../hooks/useProgram';
import { createListNFTInstruction } from '../utils/instructions';
import { DEFAULT_MARKETPLACE_NAME } from '../utils/constants';

const ListNFT = () => {
  const [nftMint, setNftMint] = useState('');
  const [price, setPrice] = useState('');
  const [marketplaceName, setMarketplaceName] = useState(DEFAULT_MARKETPLACE_NAME);
  const [success, setSuccess] = useState(false);
  
  const { connected, publicKey } = useWallet();
  const { executeTransaction, loading, error, clearError } = useProgram();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setSuccess(false);
    clearError();

    try {
      const mintPubkey = new PublicKey(nftMint);
      const priceInLamports = Math.floor(parseFloat(price) * 1_000_000_000); // Convert SOL to lamports

      const instruction = await createListNFTInstruction(
        publicKey,
        marketplaceName,
        mintPubkey,
        priceInLamports
      );

      await executeTransaction(instruction);
      setSuccess(true);
      setNftMint('');
      setPrice('');
    } catch (err) {
      console.error('Failed to list NFT:', err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent>
          <Typography>Please connect your wallet to list an NFT.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          List NFT for Sale
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Marketplace Name"
            value={marketplaceName}
            onChange={(e) => setMarketplaceName(e.target.value)}
            margin="normal"
            required
            helperText="Name of the marketplace to list on"
          />

          <TextField
            fullWidth
            label="NFT Mint Address"
            value={nftMint}
            onChange={(e) => setNftMint(e.target.value)}
            margin="normal"
            required
            helperText="The mint address of your NFT"
            placeholder="Enter the public key of your NFT mint"
          />
          
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            required
            helperText="Price in SOL"
            InputProps={{
              endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
            }}
            inputProps={{ min: "0", step: "0.001" }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              NFT listed successfully!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !nftMint || !price || !marketplaceName}
            sx={{ mt: 3 }}
          >
            {loading ? 'Listing...' : 'List NFT'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ListNFT;