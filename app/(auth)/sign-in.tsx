import { Text, ScrollView, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import { IUserProps } from '@/lib/types';
import { logIn } from '@/lib/getDataFromApi';
import Footer from '@/components/Footer';

const initUser: IUserProps = {
  email: null,
  password: null,
};

const signIn = () => {
  const { setGlobalUser, isLogged, setIsLoggedIn } = useGlobalContext();
  const [user, setUser] = useState<IUserProps>(initUser);

  useEffect(() => {
    if (isLogged) {
      router.replace('/home');
    }
  }, []);

  const handleSubmit = async () => {
    if (user.email && user.password) {
      try {
        const loggedUser = await logIn(user.email.toLowerCase(), user.password);
        setGlobalUser(loggedUser);
        setIsLoggedIn();

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
              value={user.email ?? ''}
              handleOnChange={(e: string) => setUser({ ...user, email: e })}
              mode='email'
              hint='next'
            />

            <InputCustom
              placeholder='Hasło'
              value={user.password ?? ''}
              title='Hasło'
              handleOnChange={(e: string) => setUser({ ...user, password: e })}
              isPassword
            />
          </View>

          <ButtonCustom
            title='Zaloguj się'
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={!user.email || !user.password}
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
