import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
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
import ButtonCustom from '@/components/ButtonCustom';
import { useGlobalContext } from '@/context/GlobalProvider';

const adminPostEdit = () => {
  const { query } = useLocalSearchParams();
  const { user } = useGlobalContext();
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
    if (postData && user.role.id === 1) {
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
                const singleUser = await getSingleUser(postData.author.id);
                await editUser({
                  ...singleUser[0],
                  isSuspended: !singleUser[0].isSuspended,
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
    if (postData && user.role.id === 1) {
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
                const singleUser = await getSingleUser(postData.author.id);
                await editUser({
                  ...singleUser[0],
                  isSuspended: false,
                  isBanned: !singleUser[0].isBanned,
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
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={loading || isLoading} />
      {postData ? (
        <>
          <View>
            <Text className='text-primary text-xl font-mtblack'>{`${postData.peak?.name} dodany przez ${postData.author.username}`}</Text>
            <Image
              source={{ uri: postData.photo }}
              className='w-full h-[200px] my-2 rounded-lg'
              resizeMode='cover'
            />
          </View>
          <Text className='text-primary'>{postData.notes}</Text>
        </>
      ) : null}
      <View className='my-3'>
        <IconButton
          containerStyles='my-3'
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
          containerStyles='my-3'
          isDisabled={postData?.author.isBanned || user.role.id !== 1}
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
          isDisabled={user.role.id !== 1}
          containerStyles='my-3'
          icon={postData?.author.isBanned ? icons.banned : icons.bannedActive}
          onPress={handleBan}
          title={postData?.author.isBanned ? 'Zdejmij bana' : 'Ban'}
        />
      </View>
      <ButtonCustom title='Wróć' handlePress={router.back} />
    </SafeAreaView>
  );
};

export default adminPostEdit;
