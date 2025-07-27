import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgram } from '../hooks/useProgram';
import { createUpdateFeeInstruction } from '../utils/instructions';
import { DEFAULT_MARKETPLACE_NAME } from '../utils/constants';
import MarketplaceInit from './MarketplaceInit';

const AdminPanel = () => {
  const [newFee, setNewFee] = useState(500);
  const [marketplaceName, setMarketplaceName] = useState(DEFAULT_MARKETPLACE_NAME);
  const [success, setSuccess] = useState(false);
  
  const { connected, publicKey } = useWallet();
  const { executeTransaction, loading, error, clearError } = useProgram();

  const handleUpdateFee = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setSuccess(false);
    clearError();

    try {
      const instruction = await createUpdateFeeInstruction(
        publicKey,
        marketplaceName,
        newFee
      );

      await executeTransaction(instruction);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to update fee:', err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent>
          <Typography>Please connect your wallet to access admin functions.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MarketplaceInit />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Update Marketplace Fee
              </Typography>
              
              <Box component="form" onSubmit={handleUpdateFee}>
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
                  label="New Fee (basis points)"
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(parseInt(e.target.value) || 0)}
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
                    Fee updated successfully!
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !marketplaceName || newFee < 1 || newFee > 10000}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Updating...' : 'Update Fee'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPanel;