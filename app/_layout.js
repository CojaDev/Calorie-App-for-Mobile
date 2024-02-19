import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
const Layout = () => {
  const [fontsLoaded] = useFonts({
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return <Stack />;
};
export default Layout;
