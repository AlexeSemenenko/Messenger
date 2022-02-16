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
      <Image
        source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg'}}
        style={styles.img}
      />

      <Text style={styles.text}>Chats</Text>

      {/*<Feather name="camera" size={24} color="black" />*/}
      <Feather name="edit-2" size={24} color="black" style={{ marginRight: 10 }} onPress={handleGoToUsersList} />

      <Ionicons name="exit-outline" size={24} color="black" onPress={handleLogOut}/>
    </View>
  )
}

export default HomeHeader
