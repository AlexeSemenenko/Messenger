import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  onPress: () => void
}

function NewGroupButton(props: Props) {
  return (
    <Pressable onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          marginLeft: 10,
        }}
      >
        <MaterialCommunityIcons name="account-group-outline" size={28} color="black" />

        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>New Group</Text>
      </View>
    </Pressable>
  )
}

export default NewGroupButton
