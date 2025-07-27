import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgram } from '../hooks/useProgram';
import { createInitializeMarketplaceInstruction } from '../utils/instructions';

const MarketplaceInit = () => {
  const [marketplaceName, setMarketplaceName] = useState('');
  const [fee, setFee] = useState(500); // 5% default
  const [success, setSuccess] = useState(false);
  
  const { connected, publicKey } = useWallet();
  const { executeTransaction, loading, error, clearError } = useProgram();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setSuccess(false);
    clearError();

    try {
      const instruction = await createInitializeMarketplaceInstruction(
        publicKey,
        marketplaceName,
        fee
      );

      await executeTransaction(instruction);
      setSuccess(true);
      setMarketplaceName('');
      setFee(500);
    } catch (err) {
      console.error('Failed to initialize marketplace:', err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent>
          <Typography>Please connect your wallet to initialize a marketplace.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Initialize New Marketplace
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Marketplace Name"
            value={marketplaceName}
            onChange={(e) => setMarketplaceName(e.target.value)}
            margin="normal"
            required
            helperText="Choose a unique name for your marketplace (max 32 characters)"
            inputProps={{ maxLength: 32 }}
          />
          
          <TextField
            fullWidth
            label="Fee (basis points)"
            type="number"
            value={fee}
            onChange={(e) => setFee(parseInt(e.target.value) || 0)}
            margin="normal"
            required
            helperText="Fee in basis points (500 = 5%, max 10000 = 100%)"
            inputProps={{ min: 1, max: 10000 }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Marketplace initialized successfully!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !marketplaceName || fee < 1 || fee > 10000}
            sx={{ mt: 3 }}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Initializing...' : 'Initialize Marketplace'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MarketplaceInit;