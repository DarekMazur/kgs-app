import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { getAllPosts } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { colors, icons, images } from '@/constants';
import Footer from '@/components/Footer';
import { IPostsProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';

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
  const [currentFormBox, setCurrentFormBox] = useState(initFormBox);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const ref = useRef(null);

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
      <Modal
        animationType='slide'
        transparent
        visible={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
      >
        <View className='h-full relative bg-primaryBG justify-center p-5'>
          <TouchableOpacity
            onPress={() => {
              setIsModalOpen(false);
              setCurrentFormBox(formBox);
            }}
            className='absolute top-20 right-6 w-full items-end mb-10'
          >
            <Image
              source={icons.close}
              resizeMode='contain'
              className='w-7 h-7'
            />
          </TouchableOpacity>
          <View className='text-primary flex-row gap-x-2.5 my-4'>
            <Switch
              trackColor={{
                false: colors.gray.v200,
                true: colors.gray.v100,
              }}
              thumbColor={
                currentFormBox.isLatest ? colors.gray.v200 : colors.black.v200
              }
              ios_backgroundColor={colors.gray.v100}
              onValueChange={() =>
                setCurrentFormBox({
                  ...currentFormBox,
                  isLatest: !currentFormBox.isLatest,
                })
              }
              value={currentFormBox.isLatest}
            />
            <Text className='text-primary font-mtblack'>Ostatnie posty</Text>
          </View>
          <View className='text-primary flex-row gap-x-2.5 my-4'>
            <Switch
              trackColor={{
                false: colors.gray.v200,
                true: colors.gray.v100,
              }}
              thumbColor={
                currentFormBox.isHidden ? colors.gray.v200 : colors.black.v200
              }
              ios_backgroundColor={colors.gray.v100}
              onValueChange={() =>
                setCurrentFormBox({
                  ...currentFormBox,
                  isHidden: !currentFormBox.isHidden,
                })
              }
              value={currentFormBox.isHidden}
            />
            <Text className='text-primary font-mtblack'>Ukryte posty</Text>
          </View>
          <View className='text-primary flex-row gap-x-2.5 my-4'>
            <Switch
              trackColor={{
                false: colors.gray.v200,
                true: colors.gray.v100,
              }}
              thumbColor={
                currentFormBox.isSuspended
                  ? colors.gray.v200
                  : colors.black.v200
              }
              ios_backgroundColor={colors.gray.v100}
              onValueChange={() =>
                setCurrentFormBox({
                  ...currentFormBox,
                  isSuspended: !currentFormBox.isSuspended,
                })
              }
              value={currentFormBox.isSuspended}
            />
            <Text className='text-primary font-mtblack'>
              Wpisy zawieszonych użytkowników
            </Text>
          </View>
          <View className='text-primary flex-row gap-x-2.5 my-4 mb-7'>
            <Switch
              trackColor={{
                false: colors.gray.v200,
                true: colors.gray.v100,
              }}
              thumbColor={
                currentFormBox.isBanned ? colors.gray.v200 : colors.black.v200
              }
              ios_backgroundColor={colors.gray.v100}
              onValueChange={() =>
                setCurrentFormBox({
                  ...currentFormBox,
                  isBanned: !currentFormBox.isBanned,
                })
              }
              value={currentFormBox.isBanned}
            />
            <Text className='text-primary font-mtblack'>
              Wpisy zablokowanych użytkowników
            </Text>
          </View>
          <ButtonCustom
            title='Zastosuj'
            handlePress={() => {
              setFormBox(currentFormBox);
              setIsModalOpen(false);
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default postsPanel;
