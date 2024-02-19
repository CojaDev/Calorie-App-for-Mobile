import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import delite from '../../images/delete.png';
import up from '../../images/up.png';
import down from '../../images/down.png';
import plus from '../../images/plus.png';
import dor from '../../images/break.png';
import ruc from '../../images/ruc.png';
import vec from '../../images/vec.png';
import profile from '../../images/user.png';
import * as Progress from 'react-native-progress';
import styles from './loged.style';
import { LogBox } from 'react-native';

const Loged = ({ user, isLogedIn, updateIsLoggedIn }) => {
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
  ]);

  const [pozdrav, setPozdrav] = useState('');
  const [recenica, setRecenica] = useState('');
  const [bmi, setBmi] = useState(null);
  const [dorucak, setDorucak] = useState(false);
  const [rucak, setRucak] = useState(false);
  const [vecera, setVecera] = useState(false);
  const [ukupKcalDorucak, setUkupKcalDorucak] = useState(0);
  const [ukupKcalRucak, setUkupKcalRucak] = useState(0);
  const [ukupKcalVecera, setUkupKcalVecera] = useState(0);
  const [preostaleKcal, setPreostaleKcal] = useState(0);

  const [dorucakBoja, setDorucakBoja] = useState('transparent');
  const [rucakBoja, setRucakBoja] = useState('transparent');
  const [veceraBoja, setVeceraBoja] = useState('transparent');
  const [obrok, setObrok] = useState('');
  const [nazivObroka, setNazivObroka] = useState('');
  const [opisObroka, setOpisObroka] = useState('');
  const [kalojieObroka, setKalorijeObroka] = useState('');
  const [danasnjiDatum, setDanasnjiDatum] = useState(new Date());

  const [dodavanje, setDodavanje] = useState(false);

  const [dlist, setDList] = useState([]);
  const [rlist, setRList] = useState([]);
  const [vlist, setVList] = useState([]);

  const pozdravi = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 9) {
      setPozdrav('Dobro jutro');
    } else if (currentHour >= 9 && currentHour < 19) {
      setPozdrav('Dobar dan');
    } else {
      setPozdrav('Dobro veče');
    }
  };
  useEffect(() => {
    pozdravi();
  }, []);

  const racunbmi = () => {
    let visina = parseInt(user.visina);
    let tezina = parseInt(user.tezina);
    let calculatedBmi = Math.round(tezina / Math.pow(visina / 100, 2));

    setBmi(calculatedBmi);

    console.log('Visina:', visina);
    console.log('Težina:', tezina);
    console.log('BMI:', calculatedBmi);

    if (calculatedBmi < 18.5) {
      setRecenica('AU idi jedi brzoo!');
    }
    if (calculatedBmi >= 18.5 && calculatedBmi < 24.99) {
      setRecenica('Super samo ovako nastavi!');
    }
    if (calculatedBmi >= 25 && calculatedBmi < 29.99) {
      setRecenica('Moze to i bolje');
    }
    if (calculatedBmi >= 30) {
      setRecenica('Kreni u teretanu');
    }
  };
  useEffect(() => {
    racunbmi();
  }, [user.visina, user.tezina]);

  const nazad = () => {
    updateIsLoggedIn(false);
  };

  const selectObrok = (id) => {
    if (id === 1) {
      setObrok('dorucak');
      setDorucakBoja('#a7c957');
      setRucakBoja('transparent');
      setVeceraBoja('transparent');
    } else if (id === 2) {
      setObrok('rucak');
      setDorucakBoja('transparent');
      setRucakBoja('#a7c957');
      setVeceraBoja('transparent');
    } else if (id === 3) {
      setObrok('vecera');
      setDorucakBoja('transparent');
      setRucakBoja('transparent');
      setVeceraBoja('#a7c957');
    }
  };

  const sacuvajObrok = () => {
    let naziv = nazivObroka;
    let opis = opisObroka;
    let kalorije = kalojieObroka;
    let datum = [danasnjiDatum.getMonth(), danasnjiDatum.getDate()];

    if (
      naziv === '' ||
      opis === '' ||
      kalorije === '' ||
      kalorije === null ||
      obrok === ''
    ) {
      alert('Morate popuniti sva polja');
    } else {
      const newItem = {
        naziv: naziv,
        opis: opis,
        kalorije: parseInt(kalorije),
        datum: datum,
        id: Math.random(),
      };

      // Update the state using the callback form of setState
      if (obrok === 'dorucak') {
        setDList((prevList) => {
          const updatedList = [...prevList, newItem];
          saveLists(updatedList, rlist, vlist);
          return updatedList;
        });
      }
      if (obrok === 'rucak') {
        setRList((prevList) => {
          const updatedList = [...prevList, newItem];
          saveLists(dlist, updatedList, vlist);
          return updatedList;
        });
      }
      if (obrok === 'vecera') {
        setVList((prevList) => {
          const updatedList = [...prevList, newItem];
          saveLists(dlist, rlist, updatedList);
          return updatedList;
        });
      }

      setDodavanje(false);
    }
  };

  const deleteItem = async (id, listName) => {
    try {
      let updatedListD = dlist;
      let updatedListR = rlist;
      let updatedListV = vlist;
      switch (listName) {
        case 'dorucak':
          updatedListD = dlist.filter((item) => item.id !== id);
          setDList(updatedListD);
          break;
        case 'rucak':
          updatedListR = rlist.filter((item) => item.id !== id);
          setRList(updatedListR);
          break;
        case 'vecera':
          updatedListV = vlist.filter((item) => item.id !== id);
          setVList(updatedListV);
          break;
        default:
          break;
      }

      await saveLists(updatedListD, updatedListR, updatedListV);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const saveLists = async (dlistCopy, rlistCopy, vlistCopy) => {
    try {
      await AsyncStorage.setItem('dlist', JSON.stringify(dlistCopy));
      await AsyncStorage.setItem('rlist', JSON.stringify(rlistCopy));
      await AsyncStorage.setItem('vlist', JSON.stringify(vlistCopy));

      console.log('Lists saved successfully!');
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const loadLists = async () => {
    try {
      const savedDList = await AsyncStorage.getItem('dlist');
      const savedRList = await AsyncStorage.getItem('rlist');
      const savedVList = await AsyncStorage.getItem('vlist');

      if (savedDList && savedRList && savedVList) {
        const parsedDList = JSON.parse(savedDList);
        const parsedRList = JSON.parse(savedRList);
        const parsedVList = JSON.parse(savedVList);

        const filtriranoD = parsedDList.filter((list) => {
          if (
            list.datum[0] === danasnjiDatum.getMonth() &&
            list.datum[1] === danasnjiDatum.getDate()
          ) {
            return true;
          } else {
            return false;
          }
        });

        const filtriranoR = parsedRList.filter((list) => {
          if (
            list.datum[0] === danasnjiDatum.getMonth() &&
            list.datum[1] === danasnjiDatum.getDate()
          ) {
            return true;
          } else {
            return false;
          }
        });

        const filtriranoV = parsedVList.filter((list) => {
          if (
            list.datum[0] === danasnjiDatum.getMonth() &&
            list.datum[1] === danasnjiDatum.getDate()
          ) {
            return true;
          } else {
            return false;
          }
        });

        setDList(filtriranoD);
        setRList(filtriranoR);
        setVList(filtriranoV);
      } else {
        console.log('No saved lists found.');
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const changeDorucak = () => {
    setDorucak(!dorucak);
    setRucak(false);
    setVecera(false);
  };
  const changeRucak = () => {
    setDorucak(false);
    setRucak(!rucak);
    setVecera(false);
  };
  const changeVecera = () => {
    setDorucak(false);
    setRucak(false);
    setVecera(!vecera);
  };

  const showDodavanje = () => {
    setDodavanje(true);
  };
  const calculateTotalKcal = (list, setFunction) => {
    let totalKcal = 0;
    list.forEach((kalorije) => {
      totalKcal += kalorije.kalorije;
    });
    setFunction(totalKcal);
  };

  useEffect(() => {
    calculateTotalKcal(dlist, setUkupKcalDorucak);
    calculateTotalKcal(rlist, setUkupKcalRucak);
    calculateTotalKcal(vlist, setUkupKcalVecera);
  }, [dlist, rlist, vlist]);

  useEffect(() => {
    const totalKcalSum = ukupKcalDorucak + ukupKcalRucak + ukupKcalVecera;
    const preostalo = parseInt(user.odrzavanje) - totalKcalSum;
    setPreostaleKcal(preostalo);
  }, [ukupKcalDorucak, ukupKcalRucak, ukupKcalVecera, user.odrzavanje]);
  const progressPercentage = (preostaleKcal / parseInt(user.odrzavanje)) * 100;
  return (
    <Animatable.View
      animation="fadeInRightBig"
      duration={200}
      easing="ease-out"
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={styles.naslov}>
              {pozdrav} {user.ime}
            </Text>
            <Text style={styles.podnaslov}>
              Tvoj Bmi je: {bmi} {recenica}
            </Text>
          </View>
          <TouchableOpacity style={styles.content} onPress={nazad}>
            <Image
              source={profile}
              resizeMode="cover"
              style={[styles.slike, { marginTop: 5 }]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sections}>
          <Text style={[styles.naslov, { fontSize: 20 }]}>
            Preostale kalorije
          </Text>
          <Text style={[styles.kalorije, { paddingBottom: 10 }]}>
            {preostaleKcal}/
            <Text style={{ fontSize: 25 }}>{parseInt(user.odrzavanje)}</Text>
          </Text>
          <Progress.Bar
            progress={progressPercentage / 100}
            width={null}
            height={25}
            borderRadius={10}
            color={'#a7c957'}
            animated={true}
          />
        </View>
        <View style={{ marginBottom: 100 }}>
          <View style={styles.obroci}>
            <TouchableOpacity style={styles.opis} onPress={changeDorucak}>
              <View style={dorucak ? { marginBottom: 10 } : {}}>
                <Text style={[styles.naslov, { fontSize: 20 }]}>Doručak</Text>
                <Text style={styles.podnaslov}>{ukupKcalDorucak} kcal</Text>
              </View>
              <Image
                source={dorucak ? up : down}
                resizeMode="cover"
                style={[
                  styles.slike,
                  { marginTop: 10, padding: 5, width: 20, height: 20 },
                ]}
              />
            </TouchableOpacity>
            {dorucak === true && (
              <>
                <FlatList
                  data={dlist}
                  renderItem={({ item }) => (
                    <Animatable.View
                      animation="fadeInLeftBig"
                      duration={200}
                      easing="ease-out"
                      style={styles.container}
                    >
                      <View style={[styles.obroci, { flexDirection: 'row' }]}>
                        <Text style={styles.naslov}>{item.naziv}</Text>
                        <Text>{item.opis}g</Text>
                        <Text>{item.kalorije} kcal</Text>
                        <TouchableOpacity
                          onPress={() => deleteItem(item.id, 'dorucak')}
                        >
                          <Image
                            source={delite}
                            resizeMode="cover"
                            style={[styles.slike, { width: 20, height: 20 }]}
                          />
                        </TouchableOpacity>
                      </View>
                    </Animatable.View>
                  )}
                />
                <Animatable.View
                  animation="fadeInLeftBig"
                  duration={200}
                  easing="ease-out"
                  style={styles.container}
                >
                  <TouchableOpacity
                    style={[
                      styles.obroci,
                      {
                        flexDirection: 'row',
                        borderColor: '#a7c957',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={showDodavanje}
                  >
                    <Text style={styles.naslov}>Dodaj Obrok</Text>
                    <Image
                      source={plus}
                      resizeMode="cover"
                      style={[styles.slike, { width: 20, height: 20 }]}
                    />
                  </TouchableOpacity>
                </Animatable.View>
              </>
            )}
          </View>

          <View style={styles.obroci}>
            <TouchableOpacity style={styles.opis} onPress={changeRucak}>
              <View style={rucak ? { marginBottom: 10 } : {}}>
                <Text style={[styles.naslov, { fontSize: 20 }]}>Ručak</Text>
                <Text style={styles.podnaslov}>{ukupKcalRucak} kcal</Text>
              </View>
              <Image
                source={rucak ? up : down}
                resizeMode="cover"
                style={[
                  styles.slike,
                  { marginTop: 10, padding: 5, width: 20, height: 20 },
                ]}
              />
            </TouchableOpacity>
            {rucak === true && (
              <>
                <FlatList
                  data={rlist}
                  renderItem={({ item }) => (
                    <Animatable.View
                      animation="fadeInLeftBig"
                      duration={200}
                      easing="ease-out"
                      style={styles.container}
                    >
                      <View style={[styles.obroci, { flexDirection: 'row' }]}>
                        <Text style={styles.naslov}>{item.naziv}</Text>
                        <Text>{item.opis}g</Text>
                        <Text>{item.kalorije} kcal</Text>
                        <TouchableOpacity
                          onPress={() => deleteItem(item.id, 'rucak')}
                        >
                          <Image
                            source={delite}
                            resizeMode="cover"
                            style={[styles.slike, { width: 20, height: 20 }]}
                          />
                        </TouchableOpacity>
                      </View>
                    </Animatable.View>
                  )}
                />
                <Animatable.View
                  animation="fadeInRightBig"
                  duration={200}
                  easing="ease-out"
                  style={styles.container}
                >
                  <TouchableOpacity
                    style={[
                      styles.obroci,
                      {
                        flexDirection: 'row',
                        borderColor: '#a7c957',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={showDodavanje}
                  >
                    <Text style={styles.naslov}>Dodaj Obrok</Text>
                    <Image
                      source={plus}
                      resizeMode="cover"
                      style={[styles.slike, { width: 20, height: 20 }]}
                    />
                  </TouchableOpacity>
                </Animatable.View>
              </>
            )}
          </View>

          <View style={styles.obroci}>
            <TouchableOpacity style={styles.opis} onPress={changeVecera}>
              <View style={vecera ? { marginBottom: 10 } : {}}>
                <Text style={[styles.naslov, { fontSize: 20 }]}>Večera</Text>
                <Text style={styles.podnaslov}>{ukupKcalVecera} kcal</Text>
              </View>
              <Image
                source={vecera ? up : down}
                resizeMode="cover"
                style={[
                  styles.slike,
                  { marginTop: 10, padding: 5, width: 20, height: 20 },
                ]}
              />
            </TouchableOpacity>
            {vecera === true && (
              <>
                <FlatList
                  data={vlist}
                  renderItem={({ item }) => (
                    <Animatable.View
                      animation="fadeInLeftBig"
                      duration={200}
                      easing="ease-out"
                      style={styles.container}
                    >
                      <View style={[styles.obroci, { flexDirection: 'row' }]}>
                        <Text style={styles.naslov}>{item.naziv}</Text>
                        <Text>{item.opis}g</Text>
                        <Text>{item.kalorije} kcal</Text>
                        <TouchableOpacity
                          style={{ padding: 10 }}
                          onPress={() => deleteItem(item.id, 'vecera')}
                        >
                          <Image
                            source={delite}
                            resizeMode="cover"
                            style={[styles.slike, { width: 20, height: 20 }]}
                          />
                        </TouchableOpacity>
                      </View>
                    </Animatable.View>
                  )}
                />
                <Animatable.View
                  animation="fadeInLeftBig"
                  duration={200}
                  easing="ease-out"
                  style={styles.container}
                >
                  <TouchableOpacity
                    style={[
                      styles.obroci,
                      {
                        flexDirection: 'row',
                        borderColor: '#a7c957',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={showDodavanje}
                  >
                    <Text style={styles.naslov}>Dodaj Obrok</Text>
                    <Image
                      source={plus}
                      resizeMode="cover"
                      style={[styles.slike, { width: 20, height: 20 }]}
                    />
                  </TouchableOpacity>
                </Animatable.View>
              </>
            )}
            {}
          </View>
        </View>
        {dodavanje === true && (
          <Animatable.View
            animation="fadeInLeftBig"
            duration={200}
            easing="ease-out"
            style={styles.dodavanje}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                padding: 15,
                paddingTop: 5,
              }}
            >
              Dodaj Jelo
            </Text>
            <View style={styles.wrapper}>
              <TouchableOpacity
                style={[styles.insider, { backgroundColor: dorucakBoja }]}
                onPress={() => selectObrok(1)}
              >
                <Image
                  source={dor}
                  style={[styles.slike, { width: 60, height: 60 }]}
                />
                <Text style={[styles.naslov, { textAlign: 'center' }]}>
                  Doručak
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.insider, { backgroundColor: rucakBoja }]}
                onPress={() => selectObrok(2)}
              >
                <Image
                  source={ruc}
                  style={[styles.slike, { width: 60, height: 60 }]}
                />
                <Text style={[styles.naslov, { textAlign: 'center' }]}>
                  Ručak
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.insider, { backgroundColor: veceraBoja }]}
                onPress={() => selectObrok(3)}
              >
                <Image
                  source={vec}
                  style={[styles.slike, { width: 60, height: 60 }]}
                />
                <Text style={[styles.naslov, { textAlign: 'center' }]}>
                  Večera
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.wrapper}>
              <TextInput
                style={styles.wrInputs}
                onChangeText={setNazivObroka}
                value={nazivObroka}
                placeholder="Naziv Jela.."
              />
            </View>
            <View style={styles.wrapper}>
              <View style={{ width: '100%' }}>
                <Text style={styles.jedinica}>g</Text>
                <TextInput
                  style={styles.wrInputs}
                  onChangeText={setOpisObroka}
                  value={opisObroka}
                  keyboardType="number-pad"
                  placeholder="Kolicina.."
                />
              </View>
            </View>
            <View style={styles.wrapper}>
              <TextInput
                style={styles.wrInputs}
                onChangeText={setKalorijeObroka}
                value={kalojieObroka}
                keyboardType="number-pad"
                placeholder="Kalorije.."
              />
            </View>
            <View style={styles.wrapper}>
              <TouchableOpacity
                style={[styles.insider, { backgroundColor: '#a7c957' }]}
                onPress={sacuvajObrok}
              >
                <Text
                  style={[
                    styles.naslov,
                    { textAlign: 'center', paddingHorizontal: 5 },
                  ]}
                >
                  Dodaj
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.insider, { backgroundColor: 'transparent' }]}
                onPress={() => {
                  setDodavanje(false);
                }}
              >
                <Text
                  style={[
                    styles.naslov,
                    { textAlign: 'center', paddingHorizontal: 5 },
                  ]}
                >
                  Nazad
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </View>
    </Animatable.View>
  );
};

export default Loged;
