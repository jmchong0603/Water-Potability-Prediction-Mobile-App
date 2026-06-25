import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Predict from '../screen/Predict';
import Result from '../screen/Result';

const Stack = createNativeStackNavigator();

const PredictStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Predict">
      <Stack.Screen name="Predict" component={Predict} options={{ headerShown: false }} />
      <Stack.Screen name="Result" component={Result}  options={{ headerStyle: { backgroundColor: 'rgb(94, 113, 106)' } }} />
    </Stack.Navigator>
  );
};

export default PredictStackNavigator;