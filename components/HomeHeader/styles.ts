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
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF9200',
    fontSize: 16,
  }
})

export default styles
