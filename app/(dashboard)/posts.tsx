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
import { icons, constants } from '@/constants';
import Footer from '@/components/Footer';
import { IPostFilters, IPublicPost } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Filters from '@/components/Filters';
import ScreenHeader from '@/components/ScreenHeader';
import IconButton from '@/components/IconButton';
import { pl } from '@/lang';

const initFormBox = {
  isLatest: false,
  isHidden: false,
  isSuspended: false,
  isBanned: false,
};

const postsPanel = () => {
  const { data: posts, loading: postsLoading, reFetch } = useApi(getAllPosts);
  const [filteredPosts, setFilteredPosts] = useState<IPublicPost[] | null>();
  const [formBox, setFormBox] = useState(initFormBox);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const ref = useRef(null);

  const filters = [
    {
      title: 'isLatest',
      description: pl.admin.post.list.filters.latest,
    },
    {
      title: 'isHidden',
      description: pl.admin.post.list.filters.hidden,
    },
    {
      title: 'isSuspended',
      description: pl.admin.post.list.filters.fromSuspended,
    },
    {
      title: 'isBanned',
      description: pl.admin.post.list.filters.fromBanned,
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
    setFilteredPosts(posts as IPublicPost[]);
  }, [posts]);

  useEffect(() => {
    if (filteredPosts) {
      if (formBox.isLatest) {
        setFilteredPosts(
          (posts as IPublicPost[]).filter(
            (post) =>
              Date.now() - new Date(post.createdAt).getTime() <
              constants.fullDayMilliseconds * 7,
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
        setFilteredPosts(posts as IPublicPost[]);
      }
    }
  }, [formBox]);

  const setNewForm = (form: IPostFilters) => {
    return setFormBox(form);
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={postsLoading} />
      {!postsLoading && filteredPosts ? (
        <FlatList
          ref={ref}
          data={filteredPosts as IPublicPost[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className='text-primary text-xl border-primary border-2 rounded-xl p-2 my-2'>
              <View className='py-2 mb-4 gap-2 flex-row items-center'>
                <Text
                  className={`${item.author.isBanned ? 'text-red' : item.author.role === 1 ? 'text-orange-700' : item.author.role === 2 ? 'text-orange-300' : 'text-primary'} ${item.author.isBanned ? 'line-through' : ''} font-mtbold`}
                >
                  {(item as IPublicPost).author.username}
                </Text>
                {item.isHidden || item.author.isSuspended ? (
                  <Image
                    source={
                      item.author.isSuspended
                        ? icons.suspendedActive
                        : icons.hidden
                    }
                    className='h-5 w-5'
                    resizeMode='contain'
                  />
                ) : null}
              </View>
              <Text className='text-primary'>
                {(item as IPublicPost).notes}
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
              <View className='mb-5'>
                <Text className='text-lg font-mtblack text-primary'>
                  {pl.admin.post.list.legend.title}
                </Text>
                <View className='flex-row flex-wrap gap-x-2.5'>
                  <Text className='text-orange-700 font-mtbold'>
                    {pl.admin.post.list.legend.admin}
                  </Text>
                  <Text className='text-orange-300 font-mtbold'>
                    {pl.admin.post.list.legend.mod}
                  </Text>
                  <Text className='text-red line-through font-mtbold'>
                    {pl.admin.post.list.legend.banned}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className='flex-row flex-wrap items-center gap-2.5 mb-3'
                onPress={() => router.push('/home')}
              >
                <Image
                  source={icons.logout}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
                <Text className='text-primary font-mtblack'>
                  {pl.admin.closePanel}
                </Text>
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
                {pl.admin.post.list.empty}
              </Text>

              <ButtonCustom
                title={pl.admin.post.list.back}
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
        setNewForm={(form) => setNewForm(form as IPostFilters)}
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default postsPanel;
