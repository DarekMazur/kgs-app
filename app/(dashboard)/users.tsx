import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons, images } from '@/constants';
import Footer from '@/components/Footer';

const usersPanel = () => {
  const { data: users, loading: postsLoading } = useApi(getAllUsers);

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={postsLoading} />
      <ScrollView>
        <View className='flex justify-between items-center flex-row mb-2'>
          <View>
            <Text className='text-red text-3xl font-mtblack'>Użytkownicy</Text>
          </View>
          <View>
            <Image
              source={images.logoW}
              className='w-20 h-20'
              resizeMode='contain'
            />
          </View>
        </View>
        <TouchableOpacity
          className='flex-row flex-wrap items-center gap-2.5 mb-8'
          onPress={() => router.push('/home')}
        >
          <Image
            source={icons.logout}
            className='w-6 h-6'
            resizeMode='contain'
          />
          <Text className='text-primary font-mtblack'>Zamknij panel</Text>
        </TouchableOpacity>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default usersPanel;
