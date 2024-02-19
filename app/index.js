import React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import calculator from '../images/tablica.png';
import profile from '../images/user.png';
import home from '../images/home.png';
import Login from '../components/login/login';
import Hrana from '../components/hrana/hrana';

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 60,
    backgroundColor: '#a7c957',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 0.4,
    borderColor: 'rgba(0,0,0,0.70)',
    width: '50%',
    justifyContent: 'center',
  },
  tabImage: {
    height: 35,
    width: 35,
  },
});

const Home = () => {
  const [ShowLogin, setShowLogin] = useState(true);

  const showLogin = () => {
    setShowLogin(true);
  };
  const showHrana = () => {
    setShowLogin(false);
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView>
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: '#a7c957' },
              headerShadowVisible: true,
              headerLeft: () => (
                <Text
                  style={{
                    paddingHorizontal: 20,
                    fontSize: 22,
                    fontFamily: 'Roboto',
                    fontWeight: '600',
                  }}
                >
                  {ShowLogin ? 'Kalkulator Kalorija' : 'Tablica Kalorija'}
                </Text>
              ),
              headerTitle: ' ',
            }}
          />
          <View>{ShowLogin ? <Login /> : <Hrana />}</View>
        </SafeAreaView>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={showLogin} style={styles.tabButton}>
          <Image source={home} style={styles.tabImage} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showHrana}
          style={[
            styles.tabButton,
            { borderRightWidth: 0, borderLeftWidth: 0.4 },
          ]}
        >
          <Image source={calculator} style={styles.tabImage} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Home;
