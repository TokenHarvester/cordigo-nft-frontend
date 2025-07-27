import React, { useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';

import NavBar from './components/NavBar';
import NFTGallery from './components/NFTGallery';
import ListNFT from './components/ListNFT';
import MyNFTs from './components/MyNFTs';
import AdminPanel from './components/AdminPanel';
import { NETWORK } from './utils/constants';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

function App() {
  const [currentTab, setCurrentTab] = useState('marketplace');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'marketplace':
        return <NFTGallery />;
      case 'mynfts':
        return <MyNFTs />;
      case 'list':
        return <ListNFT />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <NFTGallery />;
    }
  };

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar currentTab={currentTab} onTabChange={handleTabChange} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {renderContent()}
            </Container>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;