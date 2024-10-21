import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import { editPost, editUser, getSinglePost } from '@/lib/getDataFromApi';
import { IPostsProps } from '@/lib/types';
import Loader from '@/components/Loader';
import IconButton from '@/components/IconButton';
import { icons } from '@/constants';

const adminPostEdit = () => {
  const { query } = useLocalSearchParams();
  const { data, loading } = useApi(() => getSinglePost(query as string));
  const [postData, setPostData] = useState<IPostsProps | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setPostData((data as IPostsProps[])[0]);
    }
  }, [data]);

  const handleHide = () => {
    if (postData) {
      Alert.alert('Czy chcesz ukryć wpis?', '', [
        {
          text: 'Anuluj',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setIsLoading(true);
              await editPost({
                ...postData,
                isHidden: !postData.isHidden,
              });
              setPostData({ ...postData, isHidden: !postData.isHidden });
              setIsLoading(false);
            } catch (error) {
              Alert.alert('Błąd...', (error as Error).message);
            }
          },
        },
      ]);
    }
  };

  const handleSuspend = () => {
    if (postData) {
      Alert.alert(
        `Czy chcesz zawiesić Użytkownika ${postData?.author.username}?`,
        '',
        [
          {
            text: 'Anuluj',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                const user = await getSinglePost(postData.author.id);
                await editUser({
                  ...user,
                  isSuspended: true,
                });
              } catch (error) {
                Alert.alert('Błąd...', (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  const handleBan = () => {
    if (postData) {
      Alert.alert(
        `Czy chcesz zablokować Użytkownika ${postData?.author.username}?`,
        '',
        [
          {
            text: 'Anuluj',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                const user = await getSinglePost(postData.author.id);
                await editUser({
                  ...user,
                  isBanned: true,
                });
              } catch (error) {
                Alert.alert('Błąd...', (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView>
      <Loader isLoading={loading || isLoading} />
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
        <IconButton
          icon={postData?.isHidden ? icons.eye : icons.hidden}
          onPress={handleHide}
          title={postData?.isHidden ? 'Pokaż post' : 'Ukryj wpis'}
        />
        <IconButton
          icon={icons.suspended}
          onPress={handleSuspend}
          title='Ostrzeżenie'
        />
        <IconButton icon={icons.banned} onPress={handleBan} title='Ban' />
      </View>
    </SafeAreaView>
  );
};

export default adminPostEdit;
