import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import getThemeConfig from '../theme';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'system'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'system';
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Determine actual palette mode
  const actualMode = useMemo(() => {
    if (mode === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return mode;
  }, [mode, prefersDarkMode]);

  const theme = useMemo(() => createTheme(getThemeConfig(actualMode)), [actualMode]);

  const toggleTheme = (newMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, actualMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
