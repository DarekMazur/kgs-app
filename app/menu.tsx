import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '@/constants';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';

interface IMenuProps {
  handleLogout: () => void;
}

const Menu: FC<IMenuProps> = () => {
  const { setGlobalUser, user } = useGlobalContext();
  const [route, setRoute] = useState<Href<string | object>>('/profile');

  useEffect(() => {
    if (!user.id) {
      router.replace('/sign-in');
    }
  }, [user]);

  // eslint-disable-next-line consistent-return
  const clearData = async () => {
    try {
      await AsyncStorage.setItem('jwt', '');
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    setGlobalUser(initNewUser);
    clearData();
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full w-full items-center justify-center'>
      <TouchableOpacity
        onPress={() => router.replace(route)}
        className='absolute top-20 right-5 w-full items-end mb-10'
      >
        <Image source={icons.close} resizeMode='contain' className='w-6 h-6' />
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          className='m-4 p-2 flex-row items-center w-[60%] justify-start'
          onPress={() => {
            setRoute('/profile-edit');
            router.replace('/profile-edit');
          }}
        >
          <Image
            source={icons.editLight}
            resizeMode='contain'
            className='w-8 h-8 mr-3'
          />
          <Text className='text-primary text-lg'>Edytuj profil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='m-4 p-2 flex-row items-center w-[60%] justify-start'
          onPress={() => {
            setRoute('/create');
            router.replace('/create');
          }}
        >
          <Image
            source={icons.add}
            resizeMode='contain'
            className='w-8 h-8 mr-3'
          />
          <Text className='text-primary text-lg'>Dodaj nowy wpis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='m-4 mt-10 p-2 flex-row items-center w-[60%] justify-start'
          onPress={handleLogout}
        >
          <Image
            source={icons.logout}
            resizeMode='contain'
            className='w-8 h-8 mr-3'
          />
          <Text className='text-primary text-lg'>Wyloguj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='m-4 mt-10 p-2 flex-row items-center w-[60%] justify-start'
          onPress={() => {
            setRoute('/kgs');
            router.replace('/kgs');
          }}
        >
          <Image
            source={icons.termsKGS}
            resizeMode='contain'
            className='w-8 h-8 mr-3'
          />
          <Text className='text-primary text-lg'>Regulamin odznaki</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='m-4 p-2 flex-row items-center w-[60%] justify-start'
          onPress={() => {
            setRoute('/app-terms');
            router.replace('/app-terms');
          }}
        >
          <Image
            source={icons.terms}
            resizeMode='contain'
            className='w-8 h-8 mr-3'
          />
          <Text className='text-primary text-lg'>Polityka prywatności</Text>
        </TouchableOpacity>
        {user.role!.id < 3 ? (
          <>
            <View className='h-px mt-10 my-8 bg-gray-100 border-0 dark:bg-gray-50' />
            <TouchableOpacity
              className='mx-4 p-2 flex-row items-center w-[60%] justify-start '
              onPress={() => {
                setRoute('/dashboard');
                router.replace('/dashboard');
              }}
            >
              <Image
                source={icons.gear}
                resizeMode='contain'
                className='w-8 h-8 mr-3'
              />
              <Text className='text-lg text-primary'>Panel</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Menu;
