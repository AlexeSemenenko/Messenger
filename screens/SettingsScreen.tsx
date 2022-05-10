import React, { useEffect, useState } from 'react'
import { Pressable, Text, TextInput, SafeAreaView, View, Alert } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'
import AsyncStorage  from '@react-native-async-storage/async-storage'

import { generateKeyPair } from '../utils/crypto'
import { User as UserModel } from '../src/models'

const PRIVATE_KEY = 'PRIVATE_KEY'

function SettingsScreen() {
  const [user, setUser] = useState<UserModel | undefined>(undefined)
  const [userName, setUserName] = useState<string>('')

  async function fetchUser() {
    const userData = await Auth.currentAuthenticatedUser()
    const dbUser = await DataStore.query(UserModel, userData.attributes.sub)

    setUser(dbUser)
  }

  useEffect(
    () => {
      fetchUser()
    },
    []
  )

  useEffect(
    () => {
      setUserName(user?.realName!)
    },
    [user]
  )

  async function handleLogOut() {
    // await DataStore.clear()
    Auth.signOut()
  }

  async function handleUpdateKeyPair() {
    const { publicKey, secretKey } = generateKeyPair()

    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString())

    if (!user) {
      return
    }

    await DataStore.save(
      UserModel.copyOf(
        user,
        (updated) => {
          updated.publicKey = publicKey.toString()
        }
      )
    )

    Alert.alert('Success')
  }

  async function handleSave() {
    if (!user) {
      return
    }

    if (!userName) {
      Alert.alert('Enter your name')
      return
    }

    await DataStore.save(
      UserModel.copyOf(
        user,
        (updated) => {
          updated.realName = userName
        }
      )
    )

    Alert.alert('Successfully saved')
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={{
            marginTop: 15,
            marginBottom: 7,
            marginHorizontal: 10,
            fontWeight: 'bold',
            fontSize: 17,
          }}
        >
          Name
        </Text>

        <TextInput
          style={{
            marginHorizontal: 10,
            padding: 15,
            borderColor: '#FF9200',
            borderWidth: 1,
            borderRadius: 10,
          }}
          value={userName}
          onChangeText={setUserName}
          placeholder="Name..."
        />
      </View>

      <View>
        <Pressable
          style={{
            backgroundColor: '#FF9200',
            padding: 13,
            margin: 10,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleSave}
        >
          <Text style={{ fontWeight: 'bold', }}>Save</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: '#FF9200',
            padding: 13,
            margin: 10,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleUpdateKeyPair}
        >
          <Text style={{ fontWeight: 'bold', }}>Update key pair</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: '#FF9200',
            padding: 13,
            margin: 10,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleLogOut}
        >
          <Text style={{ fontWeight: 'bold', }}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen
