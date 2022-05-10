import React from 'react'
import { Pressable, Text } from 'react-native'
import { Auth } from 'aws-amplify'

import { generateKeyPair } from '../utils/crypto'

function SettingsScreen() {
  async function handleLogOut() {
    // await DataStore.clear()
    Auth.signOut()
  }

  async function handleUpdateKeyPair() {
    const { publicKey, secretKey } = generateKeyPair()
    console.log(publicKey, secretKey)
  }

  return (
    <>
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
    </>
  )
}

export default SettingsScreen
