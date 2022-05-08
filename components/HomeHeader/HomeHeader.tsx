import React from 'react'
import { Image, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Feather, Ionicons } from '@expo/vector-icons'
import { Auth } from 'aws-amplify'

import styles from './styles'

function HomeHeader() {
  const navigation = useNavigation()

  function handleLogOut(): void {
    Auth.signOut()
  }

  function handleGoToUsersList(): void {
    // @ts-ignore
    navigation.navigate('UsersScreen')
  }

  return (
    <View style={styles.container}>
      <Feather name="edit-2" size={24} color="#FF9200" style={{ marginRight: 10 }} onPress={handleGoToUsersList} />

      <Text style={styles.text}>Chats</Text>

      <Ionicons name="exit-outline" size={24} color="#FF9200" onPress={handleLogOut}/>
    </View>
  )
}

export default HomeHeader
