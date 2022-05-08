import React from 'react'
import { Image, Text, View, Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { User } from '../../src/models'
import styles from './styles'

type Props = {
  user: User
  handleCreate: () => void
  isSelected: undefined | boolean
}

function UserItem(props: Props): JSX.Element {
  return (
    <Pressable onPress={props.handleCreate} style={styles.container}>
      <Image source={{ uri: props.user?.imageUri }} style={styles.image} />

      <View style={styles.secondLevelContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {props.user.name}
          </Text>
        </View>
      </View>

      {props.isSelected !== undefined && (
        <Feather name={props.isSelected ? 'check-circle' : 'circle'} size={20} color="#FF9200" />
      )}
    </Pressable>
  )
}

export default UserItem
