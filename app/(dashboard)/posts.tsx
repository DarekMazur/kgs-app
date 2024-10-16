import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { getAllPosts } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { colors, icons, images } from '@/constants';
import Footer from '@/components/Footer';
import { IPostsProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';

const initFormBox = {
  isOpen: false,
  isLatest: false,
  isHidden: false,
  isSuspended: false,
  isBanned: false,
};

const postsPanel = () => {
  const { data: posts, loading: postsLoading } = useApi(getAllPosts);
  const [formBox, setFormBox] = useState(initFormBox);

  const toggleSwitch = (
    switchElement:
      | 'isOpen'
      | 'isLatest'
      | 'isHidden'
      | 'isSuspended'
      | 'isBanned',
  ) => {
    const newFormBox = { ...formBox };
    newFormBox[switchElement] = !newFormBox[switchElement];

    setFormBox(newFormBox);
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={postsLoading} />

      <ScrollView>
        {!postsLoading && posts ? (
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
              onPress={() =>
                setFormBox({ ...formBox, isOpen: !formBox.isOpen })
              }
            >
              <Image
                source={icons.filter}
                className='w-6 h-6'
                resizeMode='contain'
              />
            </TouchableOpacity>
            {posts.map((post) => (
              <View className='text-primary text-xl border-primary border-2 rounded-xl p-2 my-2'>
                <Text className='text-primary font-mtbold py-2 mb-4'>
                  {(post as IPostsProps).author.username}
                </Text>
                <Text className='text-primary'>
                  {(post as IPostsProps).notes}
                </Text>
              </View>
            ))}
            <Footer />
            <Modal
              animationType='slide'
              transparent
              visible={formBox.isOpen}
              onRequestClose={() => {
                setFormBox({ ...formBox, isOpen: !formBox.isOpen });
              }}
            >
              <View className='h-full relative bg-primaryBG justify-center p-5'>
                <TouchableOpacity
                  onPress={() => setFormBox(initFormBox)}
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
                      formBox.isLatest ? colors.gray.v200 : colors.black.v200
                    }
                    ios_backgroundColor={colors.gray.v100}
                    onValueChange={() => toggleSwitch('isLatest')}
                    value={formBox.isLatest}
                  />
                  <Text className='text-primary font-mtblack'>
                    Ostatnie posty
                  </Text>
                </View>
                <View className='text-primary flex-row gap-x-2.5 my-4'>
                  <Switch
                    trackColor={{
                      false: colors.gray.v200,
                      true: colors.gray.v100,
                    }}
                    thumbColor={
                      formBox.isHidden ? colors.gray.v200 : colors.black.v200
                    }
                    ios_backgroundColor={colors.gray.v100}
                    onValueChange={() => toggleSwitch('isHidden')}
                    value={formBox.isHidden}
                  />
                  <Text className='text-primary font-mtblack'>
                    Ukryte posty
                  </Text>
                </View>
                <View className='text-primary flex-row gap-x-2.5 my-4'>
                  <Switch
                    trackColor={{
                      false: colors.gray.v200,
                      true: colors.gray.v100,
                    }}
                    thumbColor={
                      formBox.isSuspended ? colors.gray.v200 : colors.black.v200
                    }
                    ios_backgroundColor={colors.gray.v100}
                    onValueChange={() => toggleSwitch('isSuspended')}
                    value={formBox.isSuspended}
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
                      formBox.isBanned ? colors.gray.v200 : colors.black.v200
                    }
                    ios_backgroundColor={colors.gray.v100}
                    onValueChange={() => toggleSwitch('isBanned')}
                    value={formBox.isBanned}
                  />
                  <Text className='text-primary font-mtblack'>
                    Wpisy zablokowanych użytkowników
                  </Text>
                </View>
                <ButtonCustom
                  title='Zastosuj'
                  handlePress={() =>
                    setFormBox({ ...formBox, isOpen: !formBox.isOpen })
                  }
                />
              </View>
            </Modal>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default postsPanel;
