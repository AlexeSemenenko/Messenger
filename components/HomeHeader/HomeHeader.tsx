import React from 'react'
import { Text, View, NativeModules } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { AntDesign } from '@expo/vector-icons'

import styles from './styles'

function HomeHeader() {
  const navigation = useNavigation()

  function handleGoToUsersList(): void {
    // @ts-ignore
    navigation.navigate('UsersScreen')
  }

  function handleGoToSettings(): void {
    // @ts-ignore
    navigation.navigate('Settings')
  }

  return (
    <View style={styles.container}>
      <AntDesign name="edit" size={24} color="#FF9200" onPress={handleGoToUsersList} />

      <Text style={styles.text}>Chats</Text>

      <AntDesign style={{ marginRight: 10 }} name="reload1" size={24} color="#FF9200" onPress={() => NativeModules.DevSettings.reload()} />
      <AntDesign style={{ marginRight: 10 }} name="setting" size={24} color="#FF9200" onPress={handleGoToSettings} />
    </View>
  )
}

export default HomeHeader
