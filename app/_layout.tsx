import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import GlobalProvider from '@/context/GlobalProvider';

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Montserrat-Black': require('../assets/fonts/Montserrat-Black.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-ExtraLight': require('../assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-Light': require('../assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Thin': require('../assets/fonts/Montserrat-Thin.ttf'),
    'Oooh Baby': require('../assets/fonts/OoohBaby-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='(auth)'
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name='(profile)' options={{ headerShown: false }} />
        <Stack.Screen name='(dashboard)' options={{ headerShown: false }} />
        <Stack.Screen name='(terms)' options={{ headerShown: false }} />
        <Stack.Screen
          name='menu'
          options={{
            presentation: 'modal',
            animation: 'fade',
            headerShown: false,
          }}
        />
        <Stack.Screen name='admin/posts' options={{ headerShown: false }} />
        <Stack.Screen name='post/[query]' options={{ headerShown: false }} />
        <Stack.Screen name='peak/[query]' options={{ headerShown: false }} />
        <Stack.Screen
          name='admin/post/[query]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='admin/user/[query]'
          options={{ headerShown: false }}
        />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
