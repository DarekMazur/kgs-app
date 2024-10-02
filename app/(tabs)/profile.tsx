import { View, TouchableOpacity, Image, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import { percentage } from '@/lib/helpers';
import PostCard from '@/components/PostCard';
import InfoBox from '@/components/InfoBox';
import useApi from '@/hooks/useApi';
import { getAllPeaks, getAllPosts } from '@/lib/getDataFromApi';

const profileScreen = () => {
  const { user } = useGlobalContext();
  const { data: posts } = useApi(getAllPosts);
  const { data: peaks } = useApi(getAllPeaks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (posts && peaks) {
      setIsLoading(false);
    }
  }, [posts, peaks]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <FlatList
        data={posts.filter((post) => post.author.id === user.id)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            author={item.author.firstName ?? item.author.username}
            date={new Date(item.createdAt)}
            title={item.peak.name}
            notes={item.notes}
            photoUrl={item.photo}
            isAuthor
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full flex justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              onPress={() => router.push('/menu')}
              className='flex w-full items-end mb-10'
            >
              <Image
                source={icons.bars}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-green rounded-lg flex justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />
            </View>

            <InfoBox
              title={`${user.firstName} ${user.lastName} (${user.username})`}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <InfoBox
              title='Zdobytych szczytów:'
              subtitle={`${
                posts.filter((post) => post.author.username === user.username)
                  .length || 0
              } (${percentage(
                posts.filter((post) => post.author.username === user.username)
                  .length,
                peaks.length,
              )}%)`}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default profileScreen;
