import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

export const useProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const executeTransaction = async (instruction) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('Transaction successful:', signature);
      return signature;
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    executeTransaction,
    loading,
    error,
    clearError: () => setError(null),
  };
};