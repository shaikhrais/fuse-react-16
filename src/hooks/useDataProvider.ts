'use client';

import { useState, useEffect } from 'react';
import { 
  getCurrentProvider, 
  DataProviderType, 
  switchDataProvider 
} from '@/config/dataProvider';

/**
 * React hook for data provider management
 */
export function useDataProvider() {
  const [provider, setProvider] = useState(getCurrentProvider());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProvider(getCurrentProvider());
  }, []);

  const switchProvider = (newProvider: DataProviderType) => {
    if (isClient) {
      switchDataProvider(newProvider);
      // Note: This will reload the page, so the component will unmount
    }
  };

  return {
    ...provider,
    isClient,
    switchProvider,
    isLightApiAvailable: async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        return response.ok;
      } catch {
        return false;
      }
    }
  };
}