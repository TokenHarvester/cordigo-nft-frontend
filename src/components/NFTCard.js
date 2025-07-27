import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useProgram } from '../hooks/useProgram';
import { createPurchaseNFTInstruction, createDelistNFTInstruction } from '../utils/instructions';

const NFTCard = ({ listing, marketplaceName, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { connected, publicKey } = useWallet();
  const { executeTransaction } = useProgram();

  const handlePurchase = async () => {
    if (!connected || !publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const instruction = await createPurchaseNFTInstruction(
        publicKey,
        new PublicKey(listing.seller),
        marketplaceName,
        new PublicKey(listing.mint)
      );

      await executeTransaction(instruction);
      onUpdate && onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelist = async () => {
    if (!connected || !publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const instruction = await createDelistNFTInstruction(
        publicKey,
        marketplaceName,
        new PublicKey(listing.mint)
      );

      await executeTransaction(instruction);
      onUpdate && onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = connected && publicKey && listing.seller === publicKey.toString();
  const priceInSOL = listing.price / 1_000_000_000; // Convert lamports to SOL

  return (
    <Card sx={{ maxWidth: 345, margin: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          NFT Listing
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Mint:</strong> {listing.mint.slice(0, 8)}...{listing.mint.slice(-4)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Seller:</strong> {listing.seller.slice(0, 8)}...{listing.seller.slice(-4)}
        </Typography>
        
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          {priceInSOL.toFixed(3)} SOL
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
      
      <CardActions>
        {isOwner ? (
          <Button
            size="small"
            color="secondary"
            onClick={handleDelist}
            disabled={loading}
          >
            {loading ? 'Delisting...' : 'Delist'}
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            onClick={handlePurchase}
            disabled={loading || !connected}
          >
            {loading ? 'Purchasing...' : 'Buy Now'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default NFTCard;