import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from '../hooks/useProgram';
import { createDelistNFTInstruction } from '../utils/instructions';
import { DEFAULT_MARKETPLACE_NAME } from '../utils/constants';

const MyNFTs = () => {
  const [nftMint, setNftMint] = useState('');
  const [marketplaceName, setMarketplaceName] = useState(DEFAULT_MARKETPLACE_NAME);
  const [success, setSuccess] = useState(false);
  
  const { connected, publicKey } = useWallet();
  const { executeTransaction, loading, error, clearError } = useProgram();

  const handleDelist = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setSuccess(false);
    clearError();

    try {
      const mintPubkey = new PublicKey(nftMint);

      const instruction = await createDelistNFTInstruction(
        publicKey,
        marketplaceName,
        mintPubkey
      );

      await executeTransaction(instruction);
      setSuccess(true);
      setNftMint('');
    } catch (err) {
      console.error('Failed to delist NFT:', err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent>
          <Typography>Please connect your wallet to manage your NFTs.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My NFTs
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delist NFT
              </Typography>
              
              <Box component="form" onSubmit={handleDelist} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Marketplace Name"
                  value={marketplaceName}
                  onChange={(e) => setMarketplaceName(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="NFT Mint Address"
                  value={nftMint}
                  onChange={(e) => setNftMint(e.target.value)}
                  margin="normal"
                  required
                  helperText="The mint address of the NFT you want to delist"
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    NFT delisted successfully!
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={loading || !nftMint || !marketplaceName}
                  sx={{ mt: 3 }}
                >
                  {loading ? 'Delisting...' : 'Delist NFT'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Listed NFTs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your NFTs that are currently listed for sale will appear here.
                This feature requires additional implementation to fetch and display your specific listings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyNFTs;