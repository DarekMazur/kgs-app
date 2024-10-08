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

const postEdit = () => {
  const { query } = useLocalSearchParams();
  const { data: post, loading } = useApi(() => getSinglePost(query as string));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (post) {
      setNotes(post[0].notes);
    }
  }, [post]);

  const handleSave = async () => {
    try {
      await editPost({
        ...post[0],
        notes,
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
      <ScrollView className='m-4'>
        <View className='p-3'>
          <Text className='text-white text-center font-mtsemibold text-xl'>
            Edytuj wpis: {post[0].peak?.name}
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
    </SafeAreaView>
  );
};

export default postEdit;
