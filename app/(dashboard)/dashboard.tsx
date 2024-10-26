import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { getAllPosts, getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { IPostsProps, IUserProps } from '@/lib/types';
import { icons, constants } from '@/constants';
import Footer from '@/components/Footer';
import IconButton from '@/components/IconButton';
import ScreenHeader from '@/components/ScreenHeader';
import { pl } from '@/lang';

const dashboard = () => {
  const {
    data: users,
    loading: usersLoading,
    reFetch: usersReFetch,
  } = useApi(getAllUsers);
  const {
    data: posts,
    loading: postsLoading,
    reFetch: postsReFetch,
  } = useApi(getAllPosts);

  const onRefresh = async () => {
    await usersReFetch();
    await postsReFetch();
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();

      return () => {
        return <View />;
      };
    }, []),
  );

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={usersLoading || postsLoading} />
      <ScrollView>
        <ScreenHeader>
          <View>
            <Text className='text-red text-3xl font-mtblack'>
              {pl.admin.dashboard.title}
            </Text>
          </View>
        </ScreenHeader>
        <IconButton
          icon={icons.logout}
          iconStyle='h-6 w-6'
          onPress={() => router.push('/home')}
          title={pl.admin.closePanel}
          color='primary'
        />
        {!usersLoading && users ? (
          <>
            <View className='flex-wrap flex-row gap-1.5'>
              <Text className='text-green font-mtblack'>
                {users ? users.length : pl.admin.dashboard.noUsers}
              </Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.registered}
              </Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.includes}
              </Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter(
                    (user) =>
                      Date.now() - user.registrationDate! <
                      constants.fullDayMilliseconds * 7,
                  ).length
                }
              </Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.lastDays}
              </Text>
            </View>
            <View className='flex-wrap flex-row gap-1.5 mt-3'>
              <Text className='text-primary'>
                {pl.admin.dashboard.latestUser}{' '}
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text className='text-secondary font-mtblack'>
                  {
                    (users as IUserProps[]).sort(
                      (a, b) => b.registrationDate! - a.registrationDate!,
                    )[0].username
                  }
                </Text>
              </TouchableOpacity>
            </View>
            <IconButton
              icon={icons.defaultAvatar}
              onPress={() => {}}
              title={pl.admin.dashboard.button.showAll}
            />
          </>
        ) : null}
        {!postsLoading && posts ? (
          <>
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-green font-mtblack'>
                {posts ? posts.length : 'brak'}
              </Text>
              <Text className='text-primary'>{pl.admin.dashboard.posts}</Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.includes}
              </Text>
              <Text className='text-green font-mtblack'>
                {
                  (posts as IPostsProps[]).filter(
                    (post) =>
                      Date.now() - new Date(post.createdAt).getTime() <
                      constants.fullDayMilliseconds * 7,
                  ).length
                }
              </Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.lastDays}
              </Text>
            </View>
            <View className='flex-wrap flex-row gap-1.5 mt-3'>
              <Text className='text-primary'>
                {pl.admin.dashboard.latestPost}
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text className='text-secondary font-mtblack'>
                  {
                    (posts as IPostsProps[]).sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )[0].peak!.name
                  }{' '}
                  {pl.admin.dashboard.addedBy}{' '}
                  {
                    (posts as IPostsProps[]).sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )[0].author.username
                  }
                </Text>
              </TouchableOpacity>
            </View>
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-red font-mtblack'>
                {
                  (posts as IPostsProps[]).filter((post) => post.isHidden)
                    .length
                }
              </Text>
              <Text className='text-primary'>{pl.admin.dashboard.hidden}</Text>
            </View>
            <IconButton
              icon={icons.post}
              onPress={() => router.push('/posts')}
              title={pl.admin.dashboard.button.showAll}
            />
          </>
        ) : null}
        {!usersLoading && users ? (
          <>
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-red font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) =>
                    constants.suspensionConditions(user.suspensionTimeout),
                  ).length
                }
              </Text>
              <Text className='text-primary'>
                {pl.admin.dashboard.suspended}
              </Text>
            </View>
            <IconButton
              icon={icons.suspended}
              onPress={() => {}}
              title='Zobacz wszystkich'
            />
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-red font-mtblack'>
                {(users as IUserProps[]).filter((user) => user.isBanned).length}
              </Text>
              <Text className='text-primary'>{pl.admin.dashboard.banned}</Text>
            </View>
            <IconButton
              icon={icons.banned}
              onPress={() => {}}
              title='Zobacz wszystkich'
            />
          </>
        ) : null}
        <View className='h-px mt-10 bg-gray-100 border-0 dark:bg-gray-50 my-5' />
        {!usersLoading && users ? (
          <>
            <View className='flex-wrap flex-row gap-1.5'>
              <Text className='text-2xl text-green w-full text-center mb-3'>
                {pl.admin.dashboard.team}
              </Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) => user.role?.id === 1)
                    .length
                }
              </Text>
              <Text className='text-primary'>{pl.admin.team.admin}</Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) => user.role?.id === 2)
                    .length
                }
              </Text>
              <Text className='text-primary'>{pl.admin.dashboard.mod}</Text>
            </View>
            <IconButton
              icon={icons.appTeam}
              onPress={() => {}}
              title={pl.admin.dashboard.button.showAll}
            />
          </>
        ) : null}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default dashboard;
