import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

const Footer = () => {
  return (
    <View className='my-3 mx-4'>
      <Text className='text-primary text-center text-xl'>Footer</Text>
      <TouchableOpacity
        className='my-2'
        onPress={() => router.push('/app-terms')}
      >
        <Text className='text-primary'>App terms</Text>
      </TouchableOpacity>
      <TouchableOpacity className='my-2' onPress={() => router.push('/kgs')}>
        <Text className='text-primary'>KGS terms</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
