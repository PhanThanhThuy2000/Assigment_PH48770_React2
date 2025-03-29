import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import NotificationScreen from "../screens/NotificationScreen";
import SearchScreen from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case "Home":
                            iconName = focused ? "home" : "home-outline";
                            break;
                        case "Search":
                            iconName = focused ? "search" : "search-outline";
                            break;
                        case "Notification":
                            iconName = focused ? "notifications" : "notifications-outline";
                            break;
                        case "Account":
                            iconName = focused ? "person" : "person-outline";
                            break;
                        default:
                            iconName = "help-circle-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#c67d4d",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    paddingBottom: 10,
                    height: 60,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}