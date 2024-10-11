import { Text, ScrollView, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { images, schema } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';
import { IRegisterProps } from '@/lib/types';
import { createUser } from '@/lib/getDataFromApi';
import Footer from '@/components/Footer';

const signUp = () => {
  const { isLogged } = useGlobalContext();
  const [newUser, setNewUser] = useState<IRegisterProps>(initNewUser);

  useEffect(() => {
    if (isLogged) {
      router.replace('/home');
    }
  }, [isLogged]);

  const handleSubmit = async () => {
    if (newUser.username && newUser.email && newUser.password) {
      if (!schema.emailRegex.test(newUser.email)) {
        Alert.alert('Błąd...', 'Niepoprawny format adresu email');
        return;
      }
      try {
        const registeredUser = await createUser(
          newUser.username,
          newUser.email.toLowerCase(),
          newUser.password,
        );

        if (registeredUser) {
          Alert.alert('Sukces!', 'Zaloguj się na swoje konto');

          router.replace('/sign-in');
        }
      } catch (err) {
        Alert.alert('Błąd...', (err as Error).message);
      }
    } else {
      Alert.alert('Uwaga!', 'Podaj wymagane dane!');
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
            Zarejestruj się i zacznij zdobywać szczyty Korony Gór
            Świętokrzyskich już dziś!
          </Text>

          <View className='my-2 pb-4 relative'>
            <InputCustom
              placeholder='Nazwa użytkownika'
              title='Nazwa użytkownika'
              value={newUser.username ?? ''}
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, username: e })
              }
              hint='next'
            />

            <InputCustom
              placeholder='Email'
              title='Email'
              value={newUser.email ?? ''}
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, email: e })
              }
              mode='email'
              hint='next'
            />

            <InputCustom
              placeholder='Hasło'
              value={newUser.password ?? ''}
              title='Hasło'
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, password: e })
              }
              isPassword
              mode='email'
            />
          </View>

          <ButtonCustom
            title='Utwórz konto'
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={
              !newUser.username || !newUser.email || !newUser.password
            }
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Masz już konto?
            </Text>
            <Link
              href='./sign-in'
              className='text-lg font-psemibold text-secondary'
            >
              Zaloguj się
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signUp;
