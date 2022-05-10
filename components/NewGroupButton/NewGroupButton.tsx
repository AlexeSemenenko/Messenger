import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
  onPress: () => void
  ref: any
  changeName: any
  groupName: string
  isGroupCreating: boolean
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

        {props.isGroupCreating && (
          <TextInput
            ref={props.ref}
            style={{
              marginHorizontal: 10,
              padding: 15,
              borderColor: '#FF9200',
              borderWidth: 1,
              borderRadius: 10,
              flex: 1,
            }}
            onEndEditing={props.changeName}
            defaultValue={props.groupName}
            placeholder="Group Name..."
          />
        )}
      </View>
    </Pressable>
  )
}

export default NewGroupButton
