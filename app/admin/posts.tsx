import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { getAllPosts } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { IPostsProps } from '@/lib/types';

const adminPostsView = () => {
  const { data: posts, loading, reFetch } = useApi(getAllPosts);
  const [formBox, setFormBox] = useState({
    isLatest: false,
    isHidden: false,
    isSuspended: false,
    isBanned: false,
  });

  return (
    <SafeAreaView className='bg-primaryBG w-full p-3'>
      <Loader isLoading={loading} />
      {!loading && posts ? (
        <>
          <View className='flex-row flex-wrap items-start gap-3.5 my-3'>
            <View className='text-primary flex-row gap-x-2.5'>
              <Checkbox
                value={formBox.isLatest}
                onValueChange={() =>
                  setFormBox({ ...formBox, isLatest: !formBox.isLatest })
                }
              />
              <Text className='text-primary font-mtblack'>Ostatnie posty</Text>
            </View>
            <View className='text-primary flex-row gap-x-2.5'>
              <Checkbox
                value={formBox.isHidden}
                onValueChange={() =>
                  setFormBox({ ...formBox, isHidden: !formBox.isHidden })
                }
              />
              <Text className='text-primary font-mtblack'>Ukryte posty</Text>
            </View>
            <View className='text-primary flex-row gap-x-2.5'>
              <Checkbox
                value={formBox.isSuspended}
                onValueChange={() =>
                  setFormBox({ ...formBox, isSuspended: !formBox.isSuspended })
                }
              />
              <Text className='text-primary font-mtblack'>
                Wpisy zawieszonych użytkowników
              </Text>
            </View>
            <View className='text-primary flex-row gap-x-2.5'>
              <Checkbox
                value={formBox.isBanned}
                onValueChange={() =>
                  setFormBox({ ...formBox, isBanned: !formBox.isBanned })
                }
              />
              <Text className='text-primary font-mtblack'>
                Wpisy zablokowanych użytkowników
              </Text>
            </View>
          </View>
          <ScrollView>
            {posts.map((post) => (
              <View className='text-primary text-xl'>
                <Text className='text-primary font-mtbold my-4'>
                  {(post as IPostsProps).author.username}
                </Text>
                <Text className='text-primary'>
                  {(post as IPostsProps).notes}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default adminPostsView;
