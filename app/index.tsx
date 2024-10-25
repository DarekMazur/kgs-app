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
import { pl } from '../lang';

// eslint-disable-next-line no-undef
if (__DEV__) {
  server.listen();
}

const Index = () => {
  const { setGlobalUser } = useGlobalContext();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt');
      if (value !== null) {
        try {
          const current = await currentUser(value as string);
          if (current) {
            if (current.isBanned) {
              return Alert.alert(pl.index.alert.error, pl.index.alert.blocked);
            }
            setGlobalUser(current);
            setIsLogin(true);
            router.push('/home');
            return true;
          }

          return false;
        } catch (err) {
          Alert.alert(pl.alert.error, (err as Error).message);
        }
      }

      return false;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    getData();
    if (isLogin) {
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
              {pl.index.header.main}{' '}
              <Text className='text-red'>{pl.index.header.sub}</Text>
            </Text>
          </View>

          <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
            {pl.index.subheader}
          </Text>

          <ButtonCustom
            title={pl.index.login}
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
