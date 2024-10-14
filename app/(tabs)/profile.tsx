import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import { percentage } from '@/lib/helpers';
import PostCard from '@/components/PostCard';
import InfoBox from '@/components/InfoBox';
import useApi from '@/hooks/useApi';
import { deletePost, getAllPeaks, getAllPosts } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';
import { IPeakProps, IPostsProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Footer from '@/components/Footer';

const profileScreen = () => {
  const { user, setGlobalUser } = useGlobalContext();
  const { data: posts, loading, reFetch } = useApi(getAllPosts);
  const { data: peaks, loading: peaksLoading } = useApi(getAllPeaks);
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!user.id) {
      router.replace('/sign-in');
    }
  }, []);

  useScrollToTop(ref);

  const onRefresh = async () => {
    setRefreshing(true);
    await reFetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();

      return () => {
        return <View />;
      };
    }, []),
  );

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
          ref={ref}
          data={(posts as IPostsProps[]).filter(
            (post) => post.author.id === user.id,
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              peakId={(item.peak as IPeakProps).id}
              author={item.author.firstName ?? item.author.username}
              authorId={item.author.id}
              date={new Date(item.createdAt)}
              title={(item.peak as IPeakProps).name}
              notes={item.notes}
              photoUrl={item.photo}
              isAuthor
              onPress={() => handleDelete(item.id)}
              isHidden={item.isHidden}
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
                  (posts as IPostsProps[]).filter(
                    (post) => post.author.id === user.id,
                  ).length || 0
                } (${percentage(
                  (posts as IPostsProps[]).filter(
                    (post) => post.author.id === user.id,
                  ).length,
                  (peaks as IPostsProps[]).length,
                )}%)`}
                containerStyles='mt-5'
                titleStyles='text-lg'
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-sm font-mtmedium text-gray-100'>
                Brak zdobytych szczytów
              </Text>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Ruszaj na szlak!
              </Text>

              <ButtonCustom
                title='Back to Explore'
                handlePress={() => router.push('/home')}
                containerStyles='w-full my-5'
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() => <Footer />}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default profileScreen;
