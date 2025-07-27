import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNFTs } from '../hooks/useNFTs';
import NFTCard from './NFTCard';
import { DEFAULT_MARKETPLACE_NAME } from '../utils/constants';

const NFTGallery = () => {
  const { listings, loading, refetch } = useNFTs(DEFAULT_MARKETPLACE_NAME);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (listings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No NFTs listed yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Be the first to list an NFT for sale!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        NFT Marketplace
      </Typography>
      
      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.pubkey}>
            <NFTCard
              listing={listing}
              marketplaceName={DEFAULT_MARKETPLACE_NAME}
              onUpdate={refetch}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NFTGallery;