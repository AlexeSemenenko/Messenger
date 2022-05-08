import  React, { useState, useEffect } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Pressable, Text } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Auth, DataStore } from 'aws-amplify'

import UserItem from '../components/UserItem'
import { ChatRoom, ChatRoomUser, User } from '../src/models'
import NewGroupButton from '../components/NewGroupButton'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
  button: {
    backgroundColor: '#FF9200',
    marginHorizontal: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
})

function UsersScreen() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false)

  const navigation = useNavigation()

  useEffect(
    () => {
      DataStore.query(User).then(setUsers)
    },
    []
  )

  async function addUserToChatRoom(user: User, chatRoom: ChatRoom) {
    await DataStore.save(new ChatRoomUser({
      user,
      chatRoom,
    }))
  }

  async function createChatRoom(users: User[]): Promise<void> {
    // TODO if chat room exists don't create a new one

    const authUser = await Auth.currentAuthenticatedUser()
    const dbUser = await DataStore.query(User, authUser.attributes.sub)

    const newChatRoomData = {
      newMessages: 0,
      Admin: dbUser,
    }

    if (users.length > 1) {
      newChatRoomData.name = "Group"
      newChatRoomData.imageUri = "https://icon-library.com/images/icon-groups/icon-groups-26.jpg"
    }

    const newChatRoom = await  DataStore.save(new ChatRoom(newChatRoomData))

    if (dbUser) {
      await addUserToChatRoom(dbUser, newChatRoom)
    }

    await Promise.all(
      users.map(it => addUserToChatRoom(it, newChatRoom))
    )

    // @ts-ignore
    navigation.navigate('ChatRoom', { id: newChatRoom.id })
  }

  function isUserSelected(user: User): boolean {
    return selectedUsers.some(it => it.id === user.id)
  }

  async function onUserPress(user: User) {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        setSelectedUsers(prevState => prevState.filter(it => it.id !== user.id))
      } else {
        setSelectedUsers(prevState => [...prevState, user])
      }
    } else {
      await createChatRoom([user])
    }
  }

  async function saveGroup() {
    await createChatRoom(selectedUsers)
  }

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={users}
        ListHeaderComponent={() => <NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)} />}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isSelected={isNewGroup ? isUserSelected(item) : undefined}
            handleCreate={() => onUserPress(item)}
          />
        )}
      />

      {isNewGroup && (
        <Pressable style={styles.button} onPress={saveGroup}>
          <Text style={styles.buttonText}>Save Group ({selectedUsers.length})</Text>
        </Pressable>
      )}
    </SafeAreaView>
  )
}

export default UsersScreen
