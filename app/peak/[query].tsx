import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import { getAllPosts, getSinglePeak } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';
import { formatDate } from '@/lib/helpers';

const peak = () => {
  const { query } = useLocalSearchParams();
  const { data: singlePeak, loading } = useApi(() =>
    getSinglePeak(query as string),
  );
  const { data: posts, loading: postsLoading } = useApi(getAllPosts);
  const [hikers, setHikers] = useState([]);

  useEffect(() => {
    if (posts && singlePeak) {
      // eslint-disable-next-line array-callback-return
      const peakPosts = posts.filter(
        (post) => post.peak.id === singlePeak[0].id,
      );
      const peakConquerors = [];

      peakPosts.forEach((post) =>
        peakConquerors.push({ ...post.author, time: post.createdAt }),
      );

      setHikers(peakConquerors);
    }
  }, [posts, singlePeak]);

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <Loader isLoading={loading} />
      {!loading ? (
        <ScrollView className='m-4'>
          <View className='p-3'>
            <Text className='text-primary font-mtblack text-3xl text-center pb-2'>
              {singlePeak[0].name} - {singlePeak[0].height} m
            </Text>
            <Image
              source={{ uri: singlePeak[0].image }}
              className='w-full h-[300px] self-center my-4'
              resizeMode='cover'
            />
            <Text className='text-secondary text-sm self-end mb-3'>
              {singlePeak[0].trial}
            </Text>
            <Text className='text-primary text-lg my-4 leading-6'>
              {singlePeak[0].description}
            </Text>
          </View>
          <View>
            {hikers.length > 0 ? (
              <>
                <Text className='text-secondary mb-2'>Szyt zdobyli</Text>
                {hikers.map((hiker, index) => (
                  <Text key={hiker.id} className='py-1 text-primary'>
                    {index + 1}.{' '}
                    {hiker.firstName
                      ? `${hiker.firstName} (${hiker.username})`
                      : hiker.username}{' '}
                    ({formatDate(new Date(hiker.time))})
                  </Text>
                ))}
              </>
            ) : (
              <Text className='text-primary'>Bądź pierwszy!</Text>
            )}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default peak;
