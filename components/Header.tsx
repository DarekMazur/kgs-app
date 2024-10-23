import { Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const Header = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation();

  return (
    <View className='px-4 my-4'>
      <TouchableOpacity
        onPress={() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          navigation.toggleDrawer();
        }}
      >
        <Image
          source={{ uri: user.avatar }}
          className='w-[50px] h-[50px] rounded-full'
          resizeMode='cover'
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
