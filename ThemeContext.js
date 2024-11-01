import React, { createContext, useState, useContext, useEffect } from 'react';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const themes = {
  light: {
    background: '#dff7f7',
    backgroundnuevo: '#dff7f7',
    backgrounddos: '#c1e4e4',
    backgroundtres: '#c1e4e4',
    backgroundtresapp: '#3f51b5',
    text: '#575757',
    textdos: 'grey',
    textcuatro: '#93b0b0',
    buttonBackground: '#009688',
    buttonText: '#ffffff',
    textthum: '#3f51b5',
    dark: false,
    backgroundImage: require('./assets/images/wave.png'), // Añade la ruta de la imagen de fondo para el modo claro
  },
  dark: {
    background: '#2d2d2d',
    backgroundnuevo: '#3b3b3b',
    backgrounddos: '#262626',
    backgroundtres: '#171717',
    backgroundtresapp: 'white',
    text: '#dcdcdc',
    textdos: 'grey',
    textcuatro: '#646464',
    buttonBackground: '#00bfad',
    buttonText: '#000000',
    textthum: '#97a6ff',
    dark: true,
    backgroundImage: require('./assets/images/wavedark.png'), // Añade la ruta de la imagen de fondo para el modo oscuro
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);
  const [vibrationEnabled, setVibrationEnabled] = useState(false); // Estado para la vibración

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme !== null) {
          setTheme(storedTheme === 'dark' ? themes.dark : themes.light);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === themes.light ? themes.dark : themes.light;
      setTheme(newTheme);
      await AsyncStorage.setItem('appTheme', newTheme.dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  const toggleVibration = () => {
    setVibrationEnabled(prev => !prev);
  };

  const triggerVibration = () => {
    if (vibrationEnabled) {
      Vibration.vibrate(500); // Vibra durante 500ms
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, vibrationEnabled, toggleVibration, triggerVibration }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
