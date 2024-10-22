import { Image, View, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';

const Header = () => {
  const { user } = useGlobalContext();

  return (
    <View className='px-4 my-4'>
      <TouchableOpacity>
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
