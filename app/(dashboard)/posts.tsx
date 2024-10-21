import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { getAllPosts } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons } from '@/constants';
import Footer from '@/components/Footer';
import { IPostFiltersProps, IPostsProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Filters from '@/components/Filters';
import ScreenHeader from '@/components/ScreenHeader';
import IconButton from '@/components/IconButton';

const initFormBox = {
  isLatest: false,
  isHidden: false,
  isSuspended: false,
  isBanned: false,
};

const postsPanel = () => {
  const { data: posts, loading: postsLoading, reFetch } = useApi(getAllPosts);
  const [filteredPosts, setFilteredPosts] = useState<IPostsProps[] | null>();
  const [formBox, setFormBox] = useState(initFormBox);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef(null);

  const filters = [
    {
      title: 'isLatest',
      description: 'Ostatnie posty',
    },
    {
      title: 'isHidden',
      description: 'Ukryte posty',
    },
    {
      title: 'isSuspended',
      description: 'Wpisy zawieszonych użytkowników',
    },
    {
      title: 'isBanned',
      description: 'Wpisy zablokowanych użytkowników',
    },
  ];

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

  useEffect(() => {
    setFilteredPosts(posts as IPostsProps[]);
  }, [posts]);

  useEffect(() => {
    if (filteredPosts) {
      if (formBox.isLatest) {
        setFilteredPosts(
          (posts as IPostsProps[]).filter(
            (post) =>
              Date.now() - new Date(post.createdAt).getTime() <
              1000 * 60 * 60 * 24 * 7,
          ),
        );
      }

      if (formBox.isHidden) {
        setFilteredPosts(filteredPosts.filter((post) => post.isHidden));
      }

      if (formBox.isSuspended) {
        setFilteredPosts(
          filteredPosts.filter((post) => post.author.isSuspended),
        );
      }

      if (formBox.isBanned) {
        setFilteredPosts(filteredPosts.filter((post) => post.author.isBanned));
      }

      if (
        !formBox.isLatest &&
        !formBox.isHidden &&
        !formBox.isSuspended &&
        !formBox.isBanned
      ) {
        setFilteredPosts(posts as IPostsProps[]);
      }
    }
  }, [formBox]);

  const setNewForm = (form: IPostFiltersProps) => {
    return setFormBox(form);
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={postsLoading} />
      {!postsLoading && filteredPosts ? (
        <FlatList
          ref={ref}
          data={filteredPosts as IPostsProps[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className='text-primary text-xl border-primary border-2 rounded-xl p-2 my-2'>
              <View className='py-2 mb-4 gap-2 flex-row items-center'>
                <Text
                  className={`${item.author.role === 1 ? 'text-orange-700' : item.author.role === 2 ? 'text-orange-300' : 'text-primary'} font-mtbold`}
                >
                  {(item as IPostsProps).author.username}
                </Text>
                {item.isHidden ||
                item.author.isSuspended ||
                item.author.isBanned ? (
                  <Image
                    source={
                      item.author.isBanned
                        ? icons.bannedActive
                        : item.author.isSuspended
                          ? icons.suspendedActive
                          : icons.hidden
                    }
                    className='h-5 w-5'
                    resizeMode='contain'
                  />
                ) : null}
              </View>
              <Text className='text-primary'>
                {(item as IPostsProps).notes}
              </Text>
              <IconButton
                icon={icons.editLight}
                onPress={() => router.push(`/admin/post/${item.id}`)}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <ScreenHeader>
                <View>
                  <Text className='text-red text-3xl font-mtblack'>Posty</Text>
                </View>
              </ScreenHeader>
              <TouchableOpacity
                className='flex-row flex-wrap items-center gap-2.5 mb-3'
                onPress={() => router.push('/home')}
              >
                <Image
                  source={icons.logout}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
                <Text className='text-primary font-mtblack'>Zamknij panel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='items-end justify-end mb-8'
                onPress={() => setIsModalOpen(true)}
              >
                <Image
                  source={icons.filter}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Brak wpisów...
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
      <Filters
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        form={formBox}
        setNewForm={(form) => setNewForm(form as IPostFiltersProps)}
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default postsPanel;
