import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import { percentage } from '@/lib/helpers';
import PostCard from '@/components/PostCard';
import InfoBox from '@/components/InfoBox';
import useApi from '@/hooks/useApi';
import { deletePost, getAllPeaks, getAllPosts } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';

const profileScreen = () => {
  const { user } = useGlobalContext();
  const { data: posts, loading, refetch } = useApi(getAllPosts);
  const { data: peaks, loading: peaksLoading } = useApi(getAllPeaks);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Czy chcesz usunąć wpis?', '', [
      {
        text: 'Anuluj',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await deletePost(id).then(onRefresh);
          } catch (error) {
            Alert.alert('Błąd...', (error as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <Loader isLoading={loading || peaksLoading} />
      {!loading && !peaksLoading ? (
        <FlatList
          data={posts.filter((post) => post.author.id === user.id)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              author={item.author.firstName ?? item.author.username}
              date={new Date(item.createdAt)}
              title={item.peak.name}
              notes={item.notes}
              photoUrl={item.photo}
              isAuthor
              onPress={() => handleDelete(item.id)}
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
                  posts.filter((post) => post.author.id === user.id).length || 0
                } (${percentage(
                  posts.filter((post) => post.author.id === user.id).length,
                  peaks.length,
                )}%)`}
                containerStyles='mt-5'
                titleStyles='text-lg'
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : null}
    </SafeAreaView>
  );
};

export default profileScreen;
