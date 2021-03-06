import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Amplify, { Auth, DataStore } from 'aws-amplify'
import { LogBox } from 'react-native'
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import config from './src/aws-exports'
import {  User } from './src/models'

Amplify.configure(config)
console.disableYellowBox = true
function App() {
  LogBox.ignoreLogs(['Warning: ...'])
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  const [user, setUser] = useState<User | null>(null)

  useEffect(
    () => {
      if (!user) {
        return
      }

      const subscription = DataStore.observe(User, user?.id).subscribe(msg => {
        if (msg.model === User && msg.opType === 'UPDATE') {
          setUser(msg.element)
        }
      })

      return () => subscription.unsubscribe()
    },
    [user?.id]
  )

  useEffect(
    () => {
      fetchUser()
    },
    []
  )

  async function fetchUser() {
    const userData = await Auth.currentAuthenticatedUser()
    const user = await DataStore.query(User, userData.attributes.sub)

    if (user) {
      setUser(user)
    }
  }

  async function updateLastOnline() {
    if (!user) {
      return
    }

    const response = await DataStore.save(
      User.copyOf(
        user,
        (updated) => {
          updated.lastOnlineAt = +(new Date())
        }
      )
    )

    setUser(response)
  }

  useEffect(
    () => {
      const interval = setInterval(async () => {
       await updateLastOnline()
      }, 1 * 60 * 1000)

      return () => clearInterval(interval)
    },
    [user]
  )

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <ActionSheetProvider>
          <Navigation colorScheme={colorScheme} />
        </ActionSheetProvider>
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}

export default withAuthenticator(App)
