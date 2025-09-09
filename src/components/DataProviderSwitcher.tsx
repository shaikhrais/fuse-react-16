'use client';

import { useState, useEffect } from 'react';
import { 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper, 
  Typography, 
  Box,
  Chip,
  Alert
} from '@mui/material';
import { 
  DataProviderType, 
  switchDataProvider, 
  getCurrentProvider 
} from '@/config/dataProvider';

/**
 * Data Provider Switcher Component
 * Allows switching between MockAPI and LightAPI at runtime
 */
export default function DataProviderSwitcher() {
  const [currentProvider, setCurrentProvider] = useState<DataProviderType>('mock');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const provider = getCurrentProvider();
    setCurrentProvider(provider.type);
  }, []);

  const handleProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProvider = event.target.value as DataProviderType;
    switchDataProvider(newProvider);
  };

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  const provider = getCurrentProvider();

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Data Provider Settings
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current Provider: 
          <Chip 
            label={provider.type.toUpperCase()} 
            color={provider.isLight ? 'success' : 'primary'}
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Base URL: {provider.config.baseUrl}
        </Typography>
      </Box>

      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Select Data Provider</FormLabel>
        <RadioGroup
          value={currentProvider}
          onChange={handleProviderChange}
          sx={{ mt: 1 }}
        >
          <FormControlLabel 
            value="mock" 
            control={<Radio />} 
            label={
              <Box>
                <Typography variant="body2">
                  MockAPI (Default)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Static JSON data, Next.js API routes
                </Typography>
              </Box>
            }
          />
          <FormControlLabel 
            value="light" 
            control={<Radio />} 
            label={
              <Box>
                <Typography variant="body2">
                  LightAPI (SQLite)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Persistent SQLite database with Express server
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {provider.isLight && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Make sure LightAPI server is running on port 3001:
            <br />
            <code>cd src/@light-api && node cli.js serve</code>
          </Typography>
        </Alert>
      )}

      {provider.isMock && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Using MockAPI - no additional setup required.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}