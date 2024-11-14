import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import {
  editPost,
  editUser,
  getAllRoles,
  getSinglePost,
  getSingleUser,
} from '@/lib/getDataFromApi';
import { IPublicPost, IRole, IPublicUser } from '@/lib/types';
import Loader from '@/components/Loader';
import IconButton from '@/components/IconButton';
import { constants, icons } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import { pl } from '@/lang';

const adminPostEdit = () => {
  const { query } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const { data, loading } = useApi(() => getSinglePost(query as string));
  const { data: rolesData, loading: rolesLoading } = useApi(getAllRoles);
  const [postData, setPostData] = useState<IPublicPost | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setPostData((data as IPublicPost[])[0]);
    }
  }, [data]);

  const handleHide = () => {
    if (postData) {
      Alert.alert(pl.admin.post.alert.hide, '', [
        {
          text: pl.alert.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: pl.alert.confirm,
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
              Alert.alert(pl.alert.error, (error as Error).message);
            }
          },
        },
      ]);
    }
  };

  const handleSuspend = () => {
    if (postData && user.role.id <= 1) {
      Alert.alert(
        `${postData?.author.isSuspended ? `${pl.admin.post.alert.removeSuspend}` : `${pl.admin.post.alert.suspend} ${postData?.author.username} ${pl.admin.post.alert.suspendTime}`}`,
        '',
        [
          {
            text: pl.alert.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: pl.alert.confirm,
            onPress: async () => {
              try {
                const timeout = new Date(
                  Date.now() + constants.fullDayMilliseconds,
                );

                setIsLoading(true);
                const singleUser: IPublicUser[] = await getSingleUser(
                  postData.author.id,
                );
                await editUser({
                  ...singleUser[0],
                  totalSuspensions: singleUser[0].totalSuspensions + 1,
                  suspensionTimeout: constants.suspensionConditions(
                    singleUser[0].suspensionTimeout,
                  )
                    ? undefined
                    : timeout,
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
                Alert.alert(pl.alert.error, (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  const handleBan = () => {
    if (postData && user.role.id <= 1) {
      Alert.alert(
        `${postData.author.isBanned ? `${pl.admin.post.alert.removeBan}` : `${pl.admin.post.alert.ban} ${postData?.author.username}?`}`,
        '',
        [
          {
            text: pl.alert.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: pl.alert.confirm,
            onPress: async () => {
              try {
                setIsLoading(true);
                const singleUser = await getSingleUser(postData.author.id);
                await editUser({
                  ...singleUser[0],
                  suspensionTimeout: undefined,
                  isBanned: !singleUser[0].isBanned,
                  role: (rolesData as IRole[]).filter(
                    (role) => role.id === 3,
                  )[0],
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
                Alert.alert(pl.alert.error, (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={loading || rolesLoading || isLoading} />
      {postData ? (
        <>
          <View>
            <Text className='text-primary text-xl font-mtblack'>{`${postData.peak?.name} ${pl.admin.post.addedBy} ${postData.author.username}`}</Text>
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
          title={postData?.isHidden ? pl.admin.post.show : pl.admin.post.hide}
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
              ? pl.admin.post.removeSuspension
              : pl.admin.post.addSuspension
          }
        />
        <IconButton
          isDisabled={user.role.id !== 1}
          containerStyles='my-3'
          icon={postData?.author.isBanned ? icons.banned : icons.bannedActive}
          onPress={handleBan}
          title={
            postData?.author.isBanned
              ? pl.admin.post.removeBan
              : pl.admin.post.addBan
          }
        />
      </View>
      <ButtonCustom title={pl.admin.post.back} handlePress={router.back} />
    </SafeAreaView>
  );
};

export default adminPostEdit;
