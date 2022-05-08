import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'
import { useRoute } from '@react-navigation/native'

import { ChatRoom, ChatRoomUser, User } from '../../src/models'
import UserItem from '../../components/UserItem'

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    marginLeft: 10,
  }
})

function GroupInfoScreen() {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])

  const route = useRoute()

  async function fetchUsers(): Promise<void> {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      // @ts-ignore
      .filter(it => it.chatRoom.id === route.params!.id)
      .map(it => it.user)

    setAllUsers(fetchedUsers)
  }

  async function fetchChatRoom(): Promise<void> {
    // @ts-ignore
    const fetchedChatRoom = await DataStore.query(ChatRoom, route.params.id)

    if (!fetchedChatRoom) {
      console.error('No chat room with this id')
    } else {
      setChatRoom(fetchedChatRoom)
    }
  }

  useEffect(
    () => {
      // @ts-ignore
      if (!route.params?.id) {
        return
      }

      fetchChatRoom()
      fetchUsers()
    },
    []
  )

  async function confirmDelete(user: User) {
    const currentUser = await Auth.currentAuthenticatedUser()

    if (chatRoom?.Admin?.id === currentUser.attributes.sub) {
      if (user.id === chatRoom?.Admin?.id) {
        Alert.alert(
          'Warning',
          'You are the admin, you cannot delete yourself'
        )

        return
      }

      Alert.alert(
        'Confirm delete',
        `Are you sure you want to delete ${user.name} from the group?`,
        [{
          text: 'Delete',
          onPress: () => deleteUser(user),
          style: 'destructive'
        }, {
          text: 'Cancel'
        }]
      )
    }
  }

  async function deleteUser(user: User) {
    const chatRoomUsersToDelete = (await DataStore.query(ChatRoomUser))
      .filter(it => it.chatRoom.id === chatRoom?.id && it.user.id === user.id)

    if (chatRoomUsersToDelete.length > 0) {
      await  DataStore.delete(chatRoomUsersToDelete[0])
      setAllUsers(allUsers.filter(it => it.id !== user.id))
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Members</Text>

      <FlatList
        data={allUsers}
        renderItem={({ item }) => {
          const isAdmin = chatRoom?.Admin?.id === item.id

          return (
            <UserItem
              user={item}
              isAdmin={isAdmin}
              handleLongPress={() => confirmDelete(item)}
            />
          )
        }}
      />
    </View>
  )
}

export default GroupInfoScreen
