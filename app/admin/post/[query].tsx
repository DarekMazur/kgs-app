import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import { getSinglePost } from '@/lib/getDataFromApi';
import { IPostsProps } from '@/lib/types';
import Loader from '@/components/Loader';
import IconButton from '@/components/IconButton';
import { icons } from '@/constants';

const adminPostEdit = () => {
  const { query } = useLocalSearchParams();
  const { data, loading } = useApi(() => getSinglePost(query as string));
  const [postData, setPostData] = useState<IPostsProps | undefined>();

  useEffect(() => {
    if (data) {
      setPostData((data as IPostsProps[])[0]);
    }
  }, [data]);

  return (
    <SafeAreaView>
      <Loader isLoading={loading} />
      {postData ? (
        <>
          <View>
            <Text>{`${postData.peak?.name} ${postData.author.username}`}</Text>
            <Image
              source={{ uri: postData.photo }}
              className='w-full h-[200px]'
              resizeMode='cover'
            />
          </View>
          <Text>{postData.notes}</Text>
        </>
      ) : null}
      <View>
        <IconButton icon={icons.hidden} onPress={() => {}} title='Ukryj wpis' />
        <IconButton
          icon={icons.suspended}
          onPress={() => {}}
          title='Ostrzeżenie'
        />
        <IconButton icon={icons.banned} onPress={() => {}} title='Ban' />
      </View>
    </SafeAreaView>
  );
};

export default adminPostEdit;
