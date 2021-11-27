import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10,
  },
})

export default styles
