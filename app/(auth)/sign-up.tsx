import { Text, ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useState } from 'react';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { IUserProps } from '@/app/(auth)/sign-in';
import { useGlobalContext } from '@/context/GlobalProvider';

export interface IRegisterProps extends IUserProps {
  username: string | null;
}

export const initNewUser: IRegisterProps = {
  username: null,
  email: null,
  password: null,
};

const signUp = () => {
  const { user, setGlobalUser } = useGlobalContext();

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

          <View className='my-2'>
            <InputCustom
              placeholder='Nazwa użytkownika'
              title='Nazwa użytkownika'
              value={user.username ?? ''}
              handleOnChange={(e: string) =>
                setGlobalUser({ ...user, username: e })
              }
            />

            <InputCustom
              placeholder='Email'
              title='Email'
              value={user.email ?? ''}
              handleOnChange={(e: string) =>
                setGlobalUser({ ...user, email: e })
              }
            />

            <InputCustom
              placeholder='Hasło'
              value=''
              title='Hasło'
              handleOnChange={(e: string) =>
                setGlobalUser({ ...user, password: e })
              }
            />
          </View>

          <ButtonCustom
            title='Utwórz konto'
            handlePress={() => {}}
            containerStyles='mt-7'
            isLoading={false}
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
