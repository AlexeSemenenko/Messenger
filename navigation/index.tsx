import React from 'react'
import { ColorSchemeName } from 'react-native'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ChatRoomScreen from '../screens/ChatRoomScreen'
import HomeScreen from '../screens/HomeScreen'
import UsersScreen from '../screens/UsersScreen'
import HomeHeader from '../components/HomeHeader'
import ChatRoomHeader from '../components/ChatRoomHeader'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
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
        options={({ route }) => ({
          // @ts-ignore
          headerTitle: () => <ChatRoomHeader id={route.params?.id} />,
          headerTintColor: '#FF9200',
          headerBackTitleVisible: false,
      })}
      />

      <Stack.Screen
        name="UsersScreen"
        component={UsersScreen}
        options={{
          title: 'Users',
          headerTintColor: '#FF9200',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}
