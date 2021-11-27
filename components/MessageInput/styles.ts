import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  inputContainer: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3777F0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: 'white',
    fontSize: 35,
  }
})

export default styles