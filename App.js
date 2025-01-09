import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { ThemeProvider } from './src/context/ThemeContext'; // Import ThemeProvider
import store from './src/redux/store';
import AppNavigate from './src/navigate/AppNavigate';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigate />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}
