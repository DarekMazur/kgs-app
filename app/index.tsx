import { Text, View, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../constants';
import ButtonCustom from '@/components/ButtonCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import '@/mocks/msw.polyfills';
import { server } from '@/mocks/server';
import { currentUser } from '@/lib/getDataFromApi';

// eslint-disable-next-line no-undef
if (__DEV__) {
  server.listen();
}

const Index = () => {
  const { setGlobalUser } = useGlobalContext();
  const [isLoggin, setIsLoggin] = useState<boolean>(false);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt');
      if (value !== null) {
        try {
          const current = await currentUser(value as string);
          if (current) {
            setGlobalUser(current);
            setIsLoggin(true);
            router.push('/team');
            return true;
          }

          return false;
        } catch (err) {
          Alert.alert('Error', (err as Error).message);
        }
      }

      return false;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    getData();
    if (isLoggin) {
      router.replace('/home');
    }
  }, []);

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}
      >
        <View className='w-full flex justify-center items-center h-full px-4'>
          <Image
            source={images.logoFullW}
            className='w-full h-[84px] m-6'
            resizeMode='contain'
          />

          <View className='relative mt-5'>
            <Text className='text-3xl text-white font-bold text-center'>
              Poznaj region{'\n'}i zachwyć się pięknem{' '}
              <Text className='text-red'>Gór Świętokrzyskich</Text>
            </Text>
          </View>

          <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
            Zdobywaj najwyższe szczyty w najstarszych polskich górach!
          </Text>

          <ButtonCustom
            title='Zaloguj się'
            handlePress={() => router.push('/sign-in')}
            containerStyles='w-full mt-7'
            textStyles='text-2xl'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
