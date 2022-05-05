import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  sendAudioContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  audioProgressBG: {
    height: 5,
    flex: 1,
    backgroundColor: 'lightgray',
    borderRadius: 3,
    margin: 10,
  },
  audioProgressFG: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FF9200',
    position: 'absolute',
    top: -2.5,
  }
})

export default styles
