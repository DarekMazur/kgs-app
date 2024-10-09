import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useApi from '@/hooks/useApi';
import { getSinglePeak } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';

const peak = () => {
  const { query } = useLocalSearchParams();
  const { data: singlePeak, loading } = useApi(() =>
    getSinglePeak(query as string),
  );

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <Loader isLoading={loading} />
      {!loading ? (
        <ScrollView className='m-4'>
          <View className='p-3'>
            <Text className='text-secondary text-2xl'>
              {singlePeak[0].name} - {singlePeak[0].height} m
            </Text>
            <Image
              source={{ uri: singlePeak[0].image }}
              className='w-full h-[300px]'
              resizeMode='cover'
            />
            <Text className='text-primary'>{singlePeak[0].trial}</Text>
            <Text className='text-primary'>{singlePeak[0].description}</Text>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default peak;
