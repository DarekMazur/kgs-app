import { Text, ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getUser } from '@/lib/connection';
import { IUserProps } from '@/lib/types';

const initUser: IUserProps = {
  email: null,
  password: null,
};

const signIn = () => {
  const { setGlobalUser, isLogged, setIsLoggedIn } = useGlobalContext();
  const [user, setUser] = useState<IUserProps>(initUser);
  const [error, setError] = useState<string | null>(null);

  if (isLogged) {
    router.push('/home');
  }

  const handleSubmit = async () => {
    if (user.email && user.password) {
      try {
        const loggedUser = getUser(user.email, user.password);
        if (loggedUser) {
          setGlobalUser(loggedUser);
          setIsLoggedIn();
          router.push('/home');
        }
      } catch (err) {
        setError((err as Error).message);
      }
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
            />

            <InputCustom
              placeholder='Hasło'
              value={user.password ?? ''}
              title='Hasło'
              handleOnChange={(e: string) => setUser({ ...user, password: e })}
              isPassword
            />

            {error ? (
              <Text className='absolute bottom-0 w-full mt-2 font-mtbold text-red'>
                {error}
              </Text>
            ) : null}
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
