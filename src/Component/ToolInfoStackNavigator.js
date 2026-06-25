import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolDetails from '../screen/Info/ToolDetails';
import Tool from '../screen/Info/Tool';

const Stack = createNativeStackNavigator();

const ToolInfoStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Tool">
      <Stack.Screen name="Equipment" component={Tool} options={{ headerStyle: { backgroundColor: 'rgba(0, 102, 102, 0.8)' } }}/>
      <Stack.Screen name="ToolDetails" component={ToolDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ToolInfoStackNavigator;