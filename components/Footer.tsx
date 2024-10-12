import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { copyrightDate } from '@/lib/helpers';

const Footer = () => {
  return (
    <View className='my-3 mx-4'>
      <Text className='text-primary text-center'>
        Nerdistry.pl &copy; {copyrightDate()}
      </Text>
      <TouchableOpacity
        className='mt-6 mb-4'
        onPress={() => router.push('/app-terms')}
      >
        <Text className='text-secondary'>Polityka prywatności</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/kgs')}>
        <Text className='text-secondary'>Regulamin odznaki</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
