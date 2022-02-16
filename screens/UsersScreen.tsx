import  React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'

import UserItem from '../components/UserItem'
import Users from '../assets/dummy-data/Users'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})

function UsersScreen() {
  return (
    <View style={styles.page}>
      <FlatList
        data={Users}
        renderItem={({ item }) => (
          <UserItem user={item} />
        )}
      />
    </View>
  )
}

export default UsersScreen
