import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {},
  header: {
    padding: 55,
    paddingTop: 20,
    paddingBottom: 5,
    flexDirection: 'column',
  },
  naslov: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    padding: 5,
  },
  polovi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },

  pol: {
    padding: 12,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  polText: {
    fontFamily: 'Roboto',
    fontSize: 20,
  },
  content: {
    paddingBottom: 8,
    paddingHorizontal: 55,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    fontFamily: 'Roboto',
  },
  jedinica: {
    padding: 12,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    fontSize: 20,
    fontFamily: 'Roboto',
  },

  izracunaj: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a7c957',
  },
  IzText: {
    fontSize: 20,
    fontFamily: 'Roboto',
  },

  aktivnosti: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aktivnost: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
  },
  opis: {
    fontSize: 20,
    fontFamily: 'Roboto',
  },
  slike: {
    height: 35,
    width: 35,
  },
  rezultati: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'white',
  },
  rezultatii: {
    alignItems: 'center',
    marginTop: 40,
  },
  rezultat: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 12,
    fontSize: 16,
  },
  btns: {
    flexDirection: 'row',
  },
  btn: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 0,
    marginHorizontal: 10,
    marginBottom: 65,
    borderRadius: 12,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
