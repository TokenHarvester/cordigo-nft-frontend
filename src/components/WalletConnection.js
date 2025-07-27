import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box, Typography } from '@mui/material';

const WalletConnection = () => {
  const { connected, publicKey } = useWallet();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <WalletMultiButton />
      {connected && publicKey && (
        <Typography variant="body2" color="white">
          {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-4)}
        </Typography>
      )}
    </Box>
  );
};

export default WalletConnection;