import {
  Text,
  View,
  Image,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import PostCard from '@/components/PostCard';
import Recent from '@/components/Recent';
import { IPeakProps, IPostsProps, IUserRequireProps } from '@/lib/types';
import useApi from '@/hooks/useApi';
import { deletePost, getAllPosts } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';

const greetings = (user: IUserRequireProps) => {
  if (user.firstName || user.lastName) {
    return `${user.firstName ? `${user.firstName} ` : null}${user.lastName}`;
  }

  return user.username;
};

export const home = () => {
  const { data: posts, loading, refetch } = useApi(getAllPosts);
  const { user } = useGlobalContext();
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
      <Loader isLoading={loading} />
      {!loading ? (
        <FlatList
          ref={ref}
          data={posts as IPostsProps[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              peakId={(item.peak as IPeakProps).id}
              author={item.author.firstName ?? item.author.username}
              date={new Date(item.createdAt)}
              title={(item.peak as IPeakProps).name}
              notes={item.notes}
              photoUrl={item.photo}
              onPress={() => handleDelete(item.id)}
              isAuthor={user.id === item.author.id}
            />
          )}
          ListHeaderComponent={() => (
            <View className='flex my-6 px-4 space-y-6'>
              <View className='flex justify-between items-start flex-row mb-6'>
                <View>
                  <Text className='text-xl text-primary'>
                    Cześć,{'\n'}
                    <Text className='text-3xl text-red font-mtsemibold'>
                      {greetings(user)}
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
                <Recent
                  recentPosts={(posts as IPostsProps[])
                    .filter((post) => post.author?.id === user.id)
                    .slice(0, 5)}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-sm font-mtmedium text-gray-100'>
                Nikt jeszcze nie zdobył żadnego szczytu...
              </Text>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Bądź pierwszy, ruszaj na szlak!
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

export default home;
