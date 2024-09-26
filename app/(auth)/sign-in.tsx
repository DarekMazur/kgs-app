import { Text, ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useState } from 'react';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';

interface IUserProps {
  email: string | null;
  password: string | null;
}

const initUser: IUserProps = {
  email: null,
  password: null,
};

const signIn = () => {
  const [user, setUser] = useState<IUserProps>(initUser);

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

          <View className='my-2'>
            <InputCustom
              placeholder='Email'
              title='Email'
              value={user.email ?? ''}
              handleOnChange={(e: string) => setUser({ ...user, email: e })}
            />

            <InputCustom
              placeholder='Hasło'
              value=''
              title='Hasło'
              handleOnChange={(e: string) => setUser({ ...user, password: e })}
            />
          </View>

          <ButtonCustom
            title='Zaloguj się'
            handlePress={() => {}}
            containerStyles='mt-7'
            isLoading={false}
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
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
