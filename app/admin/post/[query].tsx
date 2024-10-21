import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import {
  editPost,
  editUser,
  getSinglePost,
  getSingleUser,
} from '@/lib/getDataFromApi';
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
                setIsLoading(true);
                const user = await getSingleUser(postData.author.id);
                await editUser({
                  ...user[0],
                  isSuspended: !user[0].isSuspended,
                });
                setPostData({
                  ...postData,
                  author: {
                    ...postData.author,
                    isSuspended: !postData.author.isSuspended,
                  },
                });
                setIsLoading(false);
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
                setIsLoading(true);
                const user = await getSingleUser(postData.author.id);
                await editUser({
                  ...user[0],
                  isSuspended: false,
                  isBanned: !user[0].isBanned,
                });
                setPostData({
                  ...postData,
                  author: {
                    ...postData.author,
                    isSuspended: false,
                    isBanned: !postData.author.isBanned,
                  },
                });
                setIsLoading(false);
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
          isDisabled={postData?.author.isBanned}
          icon={
            postData?.isHidden || postData?.author.isBanned
              ? icons.eye
              : icons.hidden
          }
          onPress={handleHide}
          title={postData?.isHidden ? 'Pokaż post' : 'Ukryj wpis'}
        />
        <IconButton
          isDisabled={postData?.author.isBanned}
          icon={
            postData?.author.isSuspended || postData?.author.isBanned
              ? icons.suspended
              : icons.suspendedActive
          }
          onPress={handleSuspend}
          title={
            postData?.author.isSuspended
              ? 'Zdejmij zawieszenie'
              : 'Zawieś Użytkownika'
          }
        />
        <IconButton
          icon={postData?.author.isBanned ? icons.banned : icons.bannedActive}
          onPress={handleBan}
          title={postData?.author.isBanned ? 'Zdejmij bana' : 'Ban'}
        />
      </View>
    </SafeAreaView>
  );
};

export default adminPostEdit;
