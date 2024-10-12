import { Text, ScrollView, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import { IUserProps } from '@/lib/types';
import { logIn } from '@/lib/getDataFromApi';

const initUser: IUserProps = {
  email: null,
  password: null,
};

const signIn = () => {
  const { setGlobalUser, user } = useGlobalContext();
  const [loggedUser, setLoggedUser] = useState<IUserProps>(initUser);

  useEffect(() => {
    if (user.id) {
      router.replace('/home');
    }
  }, [user]);

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('jwt', value);
      return true;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (loggedUser.email && loggedUser.password) {
      try {
        const currentUser = await logIn(
          loggedUser.email.toLowerCase(),
          loggedUser.password,
        );
        storeData(process.env.EXPO_PUBLIC_JWT as string);
        setGlobalUser(currentUser);

        router.replace('/home');
      } catch (err) {
        Alert.alert('Błąd...', (err as Error).message);
      }
    } else {
      Alert.alert('Uwaga!', 'Podaj dane logowania!');
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4'>
          <View className='items-center justify-center'>
            <Image
              source={images.logoW}
              resizeMode='contain'
              className='w-[115px] h-[115px]'
            />
          </View>

          <Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>
            Zdobywaj szczyty Korony Gór Świętokrzyskich
          </Text>

          <View className='my-2 pb-4 relative'>
            <InputCustom
              placeholder='Email'
              title='Email'
              value={loggedUser.email ?? ''}
              handleOnChange={(e: string) =>
                setLoggedUser({ ...loggedUser, email: e })
              }
              mode='email'
              hint='next'
            />

            <InputCustom
              placeholder='Hasło'
              value={loggedUser.password ?? ''}
              title='Hasło'
              handleOnChange={(e: string) =>
                setLoggedUser({ ...loggedUser, password: e })
              }
              isPassword
            />
          </View>

          <ButtonCustom
            title='Zaloguj się'
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={!loggedUser.email || !loggedUser.password}
          />

          <View className='flex justify-center mt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Nie masz konta?
            </Text>
            <Link
              href='./sign-up'
              className='text-lg font-psemibold text-secondary'
            >
              Zarejestruj się
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
