import React from 'react'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AntDesign } from '@expo/vector-icons'
import { Auth, DataStore } from 'aws-amplify'

import styles from './styles'

function HomeHeader() {
  const navigation = useNavigation()

  async function handleLogOut() {
    // await DataStore.clear()
    Auth.signOut()
  }

  function handleGoToUsersList(): void {
    // @ts-ignore
    navigation.navigate('UsersScreen')
  }

  return (
    <View style={styles.container}>
      <AntDesign name="edit" size={24} color="#FF9200" onPress={handleGoToUsersList} />

      <Text style={styles.text}>Chats</Text>

      <AntDesign name="logout" size={24} color="#FF9200" onPress={handleLogOut} />
    </View>
  )
}

export default HomeHeader
