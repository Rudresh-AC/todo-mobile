import React, {useEffect, useState} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import store from './src/store/store';
import TodoScreen from './src/screens/TodoScreen';
import LoginScreen from './src/screens/LoginScreen';
import {loadAuthStatus} from './src/store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function AppContent() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('isAuthenticated');
      if (storedStatus) {
        dispatch(loadAuthStatus());
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Todo"
        component={TodoScreen}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
}
