import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import screens
import SplshScreens from '../screens/SplashScreen/InitialScreens';
import SearchScreen from '../screens/home_Screens/SearchScreen';
import FavoritesScreen from '../screens/home_Screens/FavoritesScreen';
import RepositoryDetails from '../screens/home_Screens/RepositoryDetails';
const Stack = createNativeStackNavigator();

function AppNavigate() {
  return (
    <Stack.Navigator initialRouteName="SplshScreens">
      <Stack.Screen
        name="SplshScreens"
        component={SplshScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Details" component={RepositoryDetails} />
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppNavigate;
