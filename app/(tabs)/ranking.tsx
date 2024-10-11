import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useScrollToTop } from '@react-navigation/native';
import Loader from '@/components/Loader';
import { getAllPeaks, getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { formatDate } from '../../lib/helpers';
import { IPostsProps, IUserRequireProps } from '../../lib/types';

const rankingScreen = () => {
  const { data: peaks, loading: peaksLoading } = useApi(getAllPeaks);
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const [usersWithAllPeaks, setUsersWithAllPeaks] = useState<
    IUserRequireProps[]
  >([]);
  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    if (users && peaks) {
      setUsersWithAllPeaks(
        (users as IUserRequireProps[]).filter(
          (user) => (user.posts as IPostsProps[]).length === peaks.length,
        ),
      );
    }
  }, [peaks, users]);

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <Loader isLoading={peaksLoading || usersLoading} />
      {!peaksLoading && !usersLoading ? (
        <FlatList
          ref={ref}
          data={usersWithAllPeaks.sort(
            (a, b) =>
              new Date(
                (a.posts as IPostsProps[])[0].createdAt,
              ).getMilliseconds() -
              new Date(
                (b.posts as IPostsProps[])[0].createdAt,
              ).getMilliseconds(),
          )}
          keyExtractor={(item) => item.id as string}
          renderItem={({ item }) => (
            <View className='mx-4'>
              <Text className='text-lg text-green flex-wrap mb-2'>
                Zdobyto: {formatDate(new Date(item.posts![0].createdAt))}
              </Text>
              <View className='flex-row gap-3.5 items-center justify-start'>
                <Image
                  source={{ uri: item.avatar }}
                  className='w-14 h-14 p-2 rounded-full'
                  resizeMode='contain'
                />
                <Text className='text-xl text-primary flex-wrap'>
                  {item.firstName
                    ? `${item.firstName}${item.lastName ? ` ${item.lastName}` : null} (${item.username})`
                    : item.username}
                </Text>
              </View>
              <View className='h-px my-8 bg-gray-100 border-0 dark:bg-gray-50' />
            </View>
          )}
          ListHeaderComponent={() => (
            <View className='flex my-6 px-4 space-y-6'>
              <View className='flex justify-between items-start flex-row mb-6'>
                <View>
                  <Text className='text-2xl text-secondary'>
                    Korona Gór Śwętokrzyskich
                  </Text>
                  <Text className='text-primary text-xl'>Zdobywcy Odznaki</Text>
                </View>
                <View>
                  <Image
                    source={images.logoW}
                    className='w-20 h-20'
                    resizeMode='contain'
                  />
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-sm font-mtmedium text-gray-100'>
                Jeszcze nikomu nie udało się zdobyć wszystkich szczytów.
              </Text>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Wyrusz na szlak i bądź pierwszy!
              </Text>

              <ButtonCustom
                title='Wróć'
                handlePress={() => router.push('/home')}
                containerStyles='w-full my-5'
              />
            </View>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default rankingScreen;
