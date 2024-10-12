import {
  Text,
  ScrollView,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { images, schema } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';
import { IRegisterProps } from '@/lib/types';
import { createUser } from '@/lib/getDataFromApi';

const signUp = () => {
  const { user } = useGlobalContext();
  const [newUser, setNewUser] = useState<IRegisterProps>(initNewUser);
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    if (user.id) {
      router.replace('/home');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (newUser.username && newUser.email && newUser.password) {
      if (!isChecked) {
        Alert.alert('Błąd...', 'Musisz zatwierdzić politykę prywatności');
        return;
      }
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
            <View className='flex-row flex-wrap items-center gap-3.5 mt-4'>
              <Checkbox value={isChecked} onValueChange={setChecked} />
              <View className='flex-row flex-wrap gap-1.5'>
                <Text className='text-primary'>Akceptuję</Text>
                <TouchableOpacity
                  className='mr-2'
                  onPress={() => router.push('/app-terms')}
                >
                  <Text className='text-secondary'>politykę prywatności</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ButtonCustom
            title='Utwórz konto'
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={
              !newUser.username ||
              !newUser.email ||
              !newUser.password ||
              !isChecked
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
