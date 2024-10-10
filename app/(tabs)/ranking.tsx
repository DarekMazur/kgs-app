import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import Loader from '@/components/Loader';
import { getAllPeaks, getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';

const rankingScreen = () => {
  const { data: peaks, loading: peaksLoading } = useApi(getAllPeaks);
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const [usersWithAllPeaks, setUsersWithAllPeaks] = useState();

  useEffect(() => {
    if (users && peaks) {
      setUsersWithAllPeaks(
        users.filter((user) => user.posts.length === peaks.length),
      );
    }
  }, [peaks, users]);

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <Loader isLoading={peaksLoading || usersLoading} />
      {!peaksLoading && !usersLoading ? (
        <FlatList
          data={usersWithAllPeaks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.avatar }} style={{ width: '100%' }} />
              <Text>{item.username}</Text>
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
                Lorem Ipsum
              </Text>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Dolor sit amet
              </Text>

              <ButtonCustom
                title='Back to Explore'
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
