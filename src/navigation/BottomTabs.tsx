import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = '';
                    if (route.name === 'Home') iconName = 'home-outline';
                    else if (route.name === 'Profile') iconName = 'person-outline';
                    else if (route.name === 'Notifications') iconName = 'notifications-outline';
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}