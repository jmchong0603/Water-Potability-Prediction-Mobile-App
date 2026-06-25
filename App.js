/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import InfoStackNavigator from './src/Component/InfoStackNavigator';
import PredictStackNavigator from './src/Component/PredictStackNavigator';
import Campaign from './src/screen/Campaign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Main app component
export default function App() {
    const TabNav=createBottomTabNavigator()

    const tabConfig=[
        {
            name: "Main" ,
            component: PredictStackNavigator ,
            focusedIcon: 'water' ,
            unfocusedIcon: 'water-outline' ,
            iconComponent: Ionicons
        },
        {
            name: "Info" ,
            component: InfoStackNavigator ,
            focusedIcon: 'info' ,
            unfocusedIcon: 'info-outline' ,
            iconComponent: MaterialIcons
        },
        {
            name: "Campaign" ,
            component: Campaign ,
            focusedIcon: 'water-well' ,
            unfocusedIcon: 'water-well-outline' ,
            iconComponent: MaterialCommunityIcons
        }
    ]
    const screenOptions = ({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
            const routeConfig = tabConfig.find(config => config.name === route.name);
            const iconName = focused
                ? routeConfig.focusedIcon
                : routeConfig.unfocusedIcon;
            const IconComponent = routeConfig.iconComponent;

            return <IconComponent name={iconName} size={size} color={color} />;
        },
        headerShown: false ,
            tabBarActiveTintColor: 'black' ,
            tabBarInactiveTintColor: "#0163d2" ,
            tabBarLabelStyle: {
                fontSize: 14 ,
                paddingBottom: 5 ,
                fontWeight: '650',
                fontFamily: 'Arial',
            },
            tabBarStyle:{
                height: 65 ,
                paddingVertical: 5,
                paddingTop: 0,
                borderTopWidth: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: 'rgba(228, 231, 231, 0.9)',
        },
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is shown
    })

    return (
        <NavigationContainer>
            <TabNav.Navigator screenOptions={screenOptions}>
                {tabConfig.map(routeConfig =>(
                <TabNav.Screen 
                    key={routeConfig.name}
                    name={routeConfig.name}
                    component={routeConfig.component}
                />
                ))}
            </TabNav.Navigator>
        </NavigationContainer>

        
    )
}


