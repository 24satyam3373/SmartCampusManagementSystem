import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  const ALLOWED_MODES = ['light', 'dark', 'system'];

  // Get initial theme from localStorage or default to 'system'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return ALLOWED_MODES.includes(savedMode) ? savedMode : 'system';
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
    const safeMode = ALLOWED_MODES.includes(newMode) ? newMode : 'system';
    setMode(safeMode);
    localStorage.setItem('themeMode', safeMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, actualMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
