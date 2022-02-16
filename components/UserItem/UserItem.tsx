import React from 'react'
import { Image, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import { User } from '../../types/types'
import styles from './styles'

type Props = {
  user: User
}

function UserItem(props: Props): JSX.Element {
  const navigation = useNavigation()

  function onPress(): void {

  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: props.user?.imageUri }} style={styles.image} />

      <View style={styles.secondLevelContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {props.user.name}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default UserItem
