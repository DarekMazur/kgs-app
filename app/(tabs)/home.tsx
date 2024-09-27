import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '@/constants';

export const home = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <View className='flex my-6 px-4 space-y-6'>
        <View className='flex justify-between items-start flex-row mb-6'>
          <View>
            <Text className='text-xl text-primary'>
              Cześć,{'\n'}
              <Text className='text-3xl text-red font-mtsemibold'>
                {user.username}
              </Text>{' '}
            </Text>
            <Text className='text-primary text-xl'>witaj ponownie</Text>
          </View>
          <View>
            <Image
              source={images.logoW}
              className='w-20 h-20'
              resizeMode='contain'
            />
          </View>
        </View>
        <View>
          <Text className='text-xl text-secondary text-center'>
            Ostatnio zdobyte:
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default home;
