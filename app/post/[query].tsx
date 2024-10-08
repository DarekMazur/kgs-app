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
import { IPostsProps } from '@/lib/types';

const postEdit = () => {
  const { query } = useLocalSearchParams();
  const { data: post, loading } = useApi(() => getSinglePost(query as string));
  const [notes, setNotes] = useState('');
  const { user, setGlobalUser } = useGlobalContext();

  useEffect(() => {
    if (post) {
      setNotes((post[0] as IPostsProps).notes);
    }
  }, [post]);

  const handleSave = async () => {
    try {
      await editPost({
        ...post[0],
        notes,
      });

      setGlobalUser({
        ...user,
        posts: [
          ...user.posts.filter((userPost) => userPost.id !== post[0].id),
          post[0],
        ],
      });

      Alert.alert('Nowy opis został zapisany', 'Odśwież, aby zobaczyć zmiany');
      router.back();
    } catch (err) {
      Alert.alert('Błąd...', (err as Error).message);
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <Loader isLoading={loading} />
      {!loading && post ? (
        <ScrollView className='m-4'>
          <View className='p-3'>
            <Text className='text-white text-center font-mtsemibold text-xl'>
              Edytuj wpis: {(post[0] as IPostsProps).peak?.name}
            </Text>
            <InputCustom
              placeholder='Opis'
              title='Opis'
              value={notes ?? ''}
              hint='next'
              handleOnChange={(e: string) => {
                setNotes(e);
              }}
              isMultiline
            />
          </View>
          <ButtonCustom
            title='Zapisz'
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
