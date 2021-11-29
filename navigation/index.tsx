import React from 'react'
import { ColorSchemeName } from 'react-native'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LinkingConfiguration from './LinkingConfiguration'

import ChatRoomScreen from '../screens/ChatRoomScreen'
import HomeScreen from '../screens/HomeScreen'
import HomeHeader from '../components/HomeHeader'
import ChatRoomHeader from '../components/ChatRoomHeader'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: HomeHeader }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ headerTitle: ChatRoomHeader, headerTintColor: '#FF9200' }}  />
    </Stack.Navigator>
  )
}
