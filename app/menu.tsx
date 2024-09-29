import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FC } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '@/constants';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';

interface IMenuProps {
  handleLogout: () => void;
}

const Menu: FC<IMenuProps> = () => {
  const { setGlobalUser, setIsLoggedIn } = useGlobalContext();

  const handleLogout = () => {
    setGlobalUser(initNewUser);
    setIsLoggedIn();
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full w-full items-center justify-center'>
      <TouchableOpacity
        onPress={() => router.back()}
        className='absolute top-20 right-5 w-full items-end mb-10'
      >
        <Image source={icons.bars} resizeMode='contain' className='w-6 h-6' />
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          className='m-4 p-2 flex-row items-center w-[60%] justify-start'
          onPress={() => {}}
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
          onPress={() => {}}
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
      </View>
    </SafeAreaView>
  );
};

export default Menu;
