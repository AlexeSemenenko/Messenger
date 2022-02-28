import React from 'react'
import { Image, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Auth, DataStore } from 'aws-amplify'

import { User, ChatRoom, ChatRoomUser } from '../../src/models'
import styles from './styles'

type Props = {
  user: User
}

function UserItem(props: Props): JSX.Element {
  const navigation = useNavigation()

  async function onPress(): Promise<void> {
    // TODO if chat room exists don't create a new one

    const newChatRoom = await  DataStore.save(new ChatRoom({
      newMessages: 0,
    }))

    const authUser = await Auth.currentAuthenticatedUser()
    const dbUser = await DataStore.query(User, authUser.attributes.sub)
    await DataStore.save(new ChatRoomUser({
      user: dbUser!,
      chatRoom: newChatRoom,
    }))

    await DataStore.save(new ChatRoomUser({
      user: props.user,
      chatRoom: newChatRoom,
    }))

    // @ts-ignore
    navigation.navigate('ChatRoom', { id: newChatRoom.id })
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
