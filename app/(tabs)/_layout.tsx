import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#90CAF9',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 75,
          paddingBottom: 8,
          position: 'absolute',
          bottom: 30,
          left: 20,
          right: 20,
          borderRadius: 25,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        tabBarIconStyle: {
          marginTop: 8,
          marginBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
        tabBarItemStyle: {
          position: 'relative',
        },
      }}>
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={34} color={color} />,
          tabBarItemStyle: {
            borderRightWidth: 1,
            borderRightColor: '#E0E0E0',
          },
        }}
      />
      <Tabs.Screen
        name="glucose"
        options={{
          title: 'Glucosa',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={34} color={color} />,
          tabBarItemStyle: {
            borderRightWidth: 1,
            borderRightColor: '#E0E0E0',
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={34} color={color} />,
          tabBarItemStyle: {
            borderRightWidth: 1,
            borderRightColor: '#E0E0E0',
          },
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Recordatorios',
          tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={34} color={color} />,
          tabBarItemStyle: {
            borderRightWidth: 1,
            borderRightColor: '#E0E0E0',
          },
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color }) => <MaterialIcons name="warning" size={34} color={color} />,
        }}
      />
    </Tabs>
  );
}
