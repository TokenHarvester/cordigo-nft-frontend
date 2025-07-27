import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import { StorefrontOutlined } from '@mui/icons-material';
import WalletConnection from './WalletConnection';

const NavBar = ({ currentTab, onTabChange }) => {
  const tabs = [
    { label: 'Marketplace', value: 'marketplace' },
    { label: 'My NFTs', value: 'mynfts' },
    { label: 'List NFT', value: 'list' },
    { label: 'Admin', value: 'admin' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <StorefrontOutlined sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NFT Marketplace
        </Typography>
        
        <Box sx={{ mr: 3 }}>
          <Tabs
            value={currentTab}
            onChange={onTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{ color: 'white' }}
              />
            ))}
          </Tabs>
        </Box>

        <WalletConnection />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;