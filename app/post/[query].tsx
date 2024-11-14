import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ScrollView, Animated, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import { editPost, getSinglePost } from '@/lib/getDataFromApi';
import InputCustom from '@/components/InputCustom';
import ButtonCustom from '@/components/ButtonCustom';
import View = Animated.View;
import Loader from '@/components/Loader';
import { useGlobalContext } from '@/context/GlobalProvider';
import { IPublicPost } from '@/lib/types';
import { pl } from '@/lang';

const postEdit = () => {
  const { query } = useLocalSearchParams();
  const { data: post, loading } = useApi(() => getSinglePost(query as string));
  const [notes, setNotes] = useState('');
  const { user, setGlobalUser } = useGlobalContext();

  useEffect(() => {
    if (post) {
      setNotes((post[0] as IPublicPost).notes);
    }
  }, [post]);

  const handleSave = async () => {
    try {
      await editPost({
        ...(post as IPublicPost[])[0],
        notes,
        createdAt: new Date(Date.now()),
        photo: '',
        peak: null,
      });

      setGlobalUser({
        ...user,
        posts: [
          ...(user.posts as IPublicPost[]).filter(
            (userPost) => userPost.id !== (post as IPublicPost[])[0].id,
          ),
          (post as IPublicPost[])[0] as IPublicPost,
        ],
      });

      Alert.alert(pl.alert.success, pl.post.edit.alert.success);
      router.back();
    } catch (err) {
      Alert.alert(pl.alert.error, (err as Error).message);
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <Loader isLoading={loading} />
      {!loading && post ? (
        <ScrollView className='m-4'>
          <View className='p-3'>
            <Text className='text-white text-center font-mtsemibold text-xl'>
              {pl.post.edit.form.title} {(post[0] as IPublicPost).peak?.name}
            </Text>
            <InputCustom
              placeholder={pl.post.edit.form.description}
              title={pl.post.edit.form.description}
              value={notes ?? ''}
              hint='next'
              handleOnChange={(e: string) => {
                setNotes(e);
              }}
              isMultiline
            />
          </View>
          <ButtonCustom
            title={pl.post.edit.form.submit}
            handlePress={handleSave}
            containerStyles='mt-7'
            isLoading={false}
          />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default postEdit;
