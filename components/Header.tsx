import { Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';

const Header = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();

  return (
    <View className='px-4 my-4'>
      <TouchableOpacity
        onPress={() => {
          // @ts-expect-error
          navigation.toggleDrawer();
        }}
      >
        <Image
          source={user.avatar ? { uri: user.avatar } : icons.defaultAvatar}
          className='w-[50px] h-[50px] rounded-full'
          resizeMode='cover'
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
