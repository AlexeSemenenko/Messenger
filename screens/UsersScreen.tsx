import  React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import  { DataStore } from 'aws-amplify'

import UserItem from '../components/UserItem'
import { User } from '../src/models'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})

function UsersScreen() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(
    () => {
      DataStore.query(User).then(setUsers)
    },
    []
  )

  return (
    <View style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserItem user={item} />
        )}
      />
    </View>
  )
}

export default UsersScreen
