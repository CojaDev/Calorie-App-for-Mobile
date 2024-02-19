import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Animatable from 'react-native-animatable';
import walk from '../../images/walk.png';
import run from '../../images/run.png';
import bicikla from '../../images/bicycle.png';
import styles from './loginStyle';
import Loged from '../loged/loged';

const Login = () => {
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [tezina, setTezina] = useState('');
  const [visina, setVisina] = useState('');
  const [godine, setGodine] = useState('');
  const [isMale, setIsMale] = useState(null);
  const [aktivnost, setAktivnost] = useState(null);
  const [rezultat, setRezultat] = useState(null);
  const [odrzavanje, setOdrzavanje] = useState(null);
  const [blazi, setBlazi] = useState(null);
  const [umeren, setUmeren] = useState(null);
  const [veliki, setVeliki] = useState(null);
  const [user, setUser] = useState({});
  const [showBtn, setShowBtn] = useState(false);

  const [ime, setIme] = useState('');

  const [MbackgroundColor, setMBackgroundColor] = useState('transparent');
  const [ZbackgroundColor, setZBackgroundColor] = useState('transparent');
  const [niskaColor, setNiskaColor] = useState('transparent');
  const [srednjaColor, setSrednjaColor] = useState('transparent');
  const [visokaColor, setVisokaColor] = useState('transparent');

  const focusInputM = () => {
    setMBackgroundColor('#a7c957');
    setZBackgroundColor('transparent');
    setIsMale(true);
  };
  const focusInputZ = () => {
    setZBackgroundColor('#a7c957');
    setMBackgroundColor('transparent');
    setIsMale(false);
  };

  const niska = () => {
    setNiskaColor('#a7c957');
    setSrednjaColor('transparent');
    setVisokaColor('transparent');
    setAktivnost(1.2);
  };
  const srednja = () => {
    setNiskaColor('transparent');
    setSrednjaColor('#a7c957');
    setVisokaColor('transparent');
    setAktivnost(1.55);
  };
  const visoka = () => {
    setNiskaColor('transparent');
    setSrednjaColor('transparent');
    setVisokaColor('#a7c957');
    setAktivnost(1.9);
  };

  const Calculate = () => {
    // Provera da li su svi podaci uneti
    if (
      !tezina ||
      tezina === '0' ||
      !visina ||
      visina === '0' ||
      !godine ||
      godine === '0' ||
      aktivnost === null ||
      isMale === null
    ) {
      alert('Morate uneti sve podatke!');
      return; // Prekini funkciju ako podaci nisu uneti
    }

    // Izračunaj BMR prema polu
    let bmr;
    if (isMale) {
      bmr =
        66.5 +
        13.75 * parseInt(tezina) +
        5.003 * parseInt(visina) -
        6.75 * parseInt(godine);
    } else {
      bmr =
        655.1 +
        9.563 * parseInt(tezina) +
        1.85 * parseInt(visina) -
        4.676 * parseInt(godine);
    }

    // Postavi rezultate u state
    setRezultat(bmr);
    setOdrzavanje(bmr * aktivnost);
    setBlazi(0.9 * (bmr * aktivnost));
    setUmeren(0.8 * (bmr * aktivnost));
    setVeliki(0.5 * (bmr * aktivnost));

    console.log(bmr); // Ispis BMR u konzoli
  };
  const nazad = () => {
    // window.location.reload();
    setRezultat(null);
    setShowBtn(false);
  };

  const updateIsLoggedIn = (newValue) => {
    setIsLogedIn(newValue);
    setShowBtn(true);
  };

  const sacuvaj = async () => {
    try {
      if (ime === '' || !rezultat) {
        alert('Unesite Vaše ime!');
      } else {
        const userData = {
          ime: ime,
          tezina: tezina,
          visina: visina,
          godine: godine,
          odrzavanje: odrzavanje,
          blazi: blazi,
          umeren: umeren,
          veliki: veliki,
          rezultat: rezultat.toString(),
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsLogedIn(true);
        setShowBtn(false);
        console.log('Podaci su uspešno sačuvani.');
        setRezultat(null);
      }
    } catch (error) {
      setIsLogedIn(false);
      console.error('Greška prilikom čuvanja podataka: ', error);
    }
  };
  const cancleChange = () => {
    setIsLogedIn(true);
    setShowBtn(false);
  };
  const procitajPodatke = async () => {
    try {
      const jsonString = await AsyncStorage.getItem('user');
      if (jsonString !== null) {
        const parsedUser = JSON.parse(jsonString);
        if (parsedUser.ime === '' || parsedUser.rezultat === '') {
          setIsLogedIn(false);
        } else {
          setUser(parsedUser);
          setIsLogedIn(true);
        }
      } else {
        console.log('Nema sačuvanih podataka za ključ "user".');
        setIsLogedIn(false);
      }
    } catch (error) {
      setIsLogedIn(false);
      console.error('Greška prilikom čitanja podataka:', error);
    }
  };

  useEffect(() => {
    procitajPodatke();
  }, [ime, rezultat]);

  return (
    <Animatable.View
      animation="fadeInLeftBig"
      duration={200}
      easing="ease-out"
      style={styles.container}
    >
      {isLogedIn ? (
        <Loged
          user={user}
          isLogedIn={isLogedIn}
          updateIsLoggedIn={updateIsLoggedIn}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.naslov}>Pol</Text>
            <View style={styles.polovi}>
              <TouchableOpacity
                style={[
                  styles.pol,
                  {
                    backgroundColor: MbackgroundColor,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}
                onPress={focusInputM}
              >
                <Text style={styles.polText}>Muški</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 1,
                  height: '100%',
                  backgroundColor: 'black',
                }}
              ></View>
              <TouchableOpacity
                style={[
                  styles.pol,
                  {
                    backgroundColor: ZbackgroundColor,
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                    width: '49.8%',
                  },
                ]}
                onPress={focusInputZ}
              >
                <Text style={styles.polText}>Ženski</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.naslov}>Težina</Text>
            <View style={styles.mere}>
              <TextInput
                style={styles.input}
                maxLength={3}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setTezina}
                value={tezina}
              />
              <Text style={styles.jedinica}>kg</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.naslov}>Visina</Text>
            <View style={styles.mere}>
              <TextInput
                style={styles.input}
                maxLength={3}
                placeholder="0"
                keyboardType="number-pad"
                onChangeText={setVisina}
                value={visina}
              />
              <Text style={styles.jedinica}>cm</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.naslov}>Godine</Text>
            <View style={styles.mere}>
              <TextInput
                style={styles.input}
                maxLength={3}
                placeholder="0"
                keyboardType="number-pad"
                onChangeText={setGodine}
                value={godine}
              />
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.naslov}>Nivo Aktivnosti</Text>
            <View style={styles.aktivnosti}>
              <TouchableOpacity
                style={[
                  styles.aktivnost,
                  {
                    backgroundColor: niskaColor,
                  },
                ]}
                onPress={niska}
              >
                <Image source={walk} resizeMode="cover" style={styles.slike} />
                <Text style={styles.opis}>Niska</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.aktivnost,
                  {
                    backgroundColor: srednjaColor,
                  },
                ]}
                onPress={srednja}
              >
                <Image source={run} resizeMode="cover" style={styles.slike} />
                <Text style={styles.opis}>Srednja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.aktivnost,
                  {
                    backgroundColor: visokaColor,
                  },
                ]}
                onPress={visoka}
              >
                <Image
                  source={bicikla}
                  resizeMode="cover"
                  style={styles.slike}
                />
                <Text style={styles.opis}>Visoka</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.content, { marginTop: 10 }]}>
            <TouchableOpacity style={styles.izracunaj} onPress={Calculate}>
              <Text style={styles.IzText}>Izračunaj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showBtn === true && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 55,
          }}
        >
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: 'transparent', width: '90%' },
            ]}
            onPress={cancleChange}
          >
            <Text>Nazad</Text>
          </TouchableOpacity>
        </View>
      )}
      {rezultat !== null && (
        <Animatable.View
          animation="fadeInLeftBig"
          duration={200}
          easing="ease-in-out"
          style={styles.rezultati}
        >
          <View style={styles.rezultatii}>
            <Text style={styles.rezultat}>BMR: {parseInt(rezultat)} kcal</Text>
            <Text style={styles.rezultat}>
              Održavanje trenutne težine: {parseInt(odrzavanje)} kcal
            </Text>
            <Text style={styles.rezultat}>
              Blaži gubitak težine: {parseInt(blazi)} kcal
            </Text>
            <Text style={styles.rezultat}>
              Umeren gubitak težine: {parseInt(umeren)} kcal
            </Text>
            <Text style={styles.rezultat}>
              Veliki gubitak težine: {parseInt(veliki)} kcal
            </Text>
            <View style={styles.content}>
              <Text style={[styles.naslov, { textAlign: 'center' }]}>
                Unesi Svoje Ime
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    paddingTop: 10,
                    fontSize: 16,
                    marginTop: 10,
                    marginBottom: 5,
                    minWidth: 200,
                  },
                ]}
                placeholder="Ime"
                onChangeText={setIme}
                value={ime}
              ></TextInput>
            </View>

            <View style={styles.btns}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#a7c957' }]}
                onPress={sacuvaj}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Sacuvaj
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={nazad}>
                <Text style={{ fontSize: 18, fontWeight: 500 }}>Nazad</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

export default Login;
