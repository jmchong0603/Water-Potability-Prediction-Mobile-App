import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Information from '../screen/Information';
import Data from '../screen/Info/Data';
import Guide from '../screen/Info/Guide';
import ToolInfoStackNavigator from './ToolInfoStackNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const InfoStackNavigator = ({ navigation, route }) => {
  // Hide tab bar on these specific screens
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'Data' || routeName === 'Guide' || routeName === 'ToolInfoStackNavigator') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { height: 65 ,
        paddingVertical: 5,
        paddingTop: 0,
        borderTopWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'rgba(228, 231, 231, 0.9)', } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator initialRouteName="Information">
      <Stack.Screen name="Information" component={Information} options={{ headerShown: false }} />
      <Stack.Screen name="Data" component={Data} options={{ headerStyle: { backgroundColor: 'rgba(0, 172, 230, 0.7)' }}} />
      <Stack.Screen name="ToolInfoStackNavigator" component={ToolInfoStackNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Guide" component={Guide} options={{ headerStyle: {backgroundColor: 'rgba(0, 0, 0, 1)' },headerTintColor: 'gray'  }} />
    </Stack.Navigator>
  );
};

export default InfoStackNavigator;