import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { getAllPosts } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons, images } from '@/constants';
import Footer from '@/components/Footer';
import { IPostFiltersProps, IPostsProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Filters from '@/components/Filters';

const initFormBox = {
  isLatest: false,
  isHidden: false,
  isSuspended: false,
  isBanned: false,
};

const postsPanel = () => {
  const { data: posts, loading: postsLoading } = useApi(getAllPosts);
  const [filteredPosts, setFilteredPosts] = useState<IPostsProps[] | null>();
  const [formBox, setFormBox] = useState(initFormBox);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
              <Text className='text-primary font-mtbold py-2 mb-4'>
                {(item as IPostsProps).author.username}
              </Text>
              <Text className='text-primary'>
                {(item as IPostsProps).notes}
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <View className='flex justify-between items-center flex-row mb-2'>
                <View>
                  <Text className='text-red text-3xl font-mtblack'>Posty</Text>
                </View>
                <View>
                  <Image
                    source={images.logoW}
                    className='w-20 h-20'
                    resizeMode='contain'
                  />
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
