import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, Alert, TextInput, Pressable } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'
import { useRoute } from '@react-navigation/native'

import { ChatRoom, ChatRoomUser, User as UserModel, User } from '../../src/models'
import UserItem from '../../components/UserItem'

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingBottom: 10,
    marginLeft: 10,
  }
})

function GroupInfoScreen() {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [chatRoomName, setChatRoomName] = useState<string | null>(null)

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

  useEffect(
    () => {
      setChatRoomName(chatRoom?.name ?? null)
    },
    [chatRoom]
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
        `Are you sure you want to delete ${user.realName} from the group?`,
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

  async function handleSave() {
    if (!chatRoom) {
      return
    }

    if (!chatRoomName) {
      Alert.alert('Enter your name')
      return
    }

    await DataStore.save(
      ChatRoom.copyOf(
        chatRoom,
        (updated) => {
          updated.name = chatRoomName
        }
      )
    )

    Alert.alert('Successfully saved')
  }

  return (
    <View style={styles.root}>
      {!!chatRoom?.Admin && (
        <>
          <Text style={styles.title}>Group Name</Text>

          <TextInput
            style={{
              marginHorizontal: 10,
              padding: 15,
              borderColor: '#FF9200',
              borderWidth: 1,
              borderRadius: 10,
            }}
            value={chatRoomName!}
            onChangeText={setChatRoomName}
            placeholder="Name..."
          />

          <Pressable
            style={{
              backgroundColor: '#FF9200',
              padding: 13,
              margin: 10,
              marginBottom: 20,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={handleSave}
          >
            <Text style={{ fontWeight: 'bold', }}>Save</Text>
          </Pressable>
        </>
      )}

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
