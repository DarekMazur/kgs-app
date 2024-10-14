import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getAllPosts, getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { IPostsProps, IUserProps } from '@/lib/types';
import { icons, images } from '@/constants';
import Footer from '@/components/Footer';
import IconButton from '@/components/IconButton';

const dashboard = () => {
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const { data: posts, loading: postsLoading } = useApi(getAllPosts);

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={usersLoading || postsLoading} />
      <ScrollView>
        <View className='flex justify-between items-center flex-row mb-2'>
          <View>
            <Text className='text-red text-3xl font-mtblack'>Panel główny</Text>
          </View>
          <View>
            <Image
              source={images.logoW}
              className='w-20 h-20'
              resizeMode='contain'
            />
          </View>
        </View>
        <IconButton
          icon={icons.logout}
          iconSize={6}
          onPress={() => router.push('/home')}
          title='Zamknij panel'
          color='primary'
        />
        {!usersLoading && users ? (
          <>
            <View className='flex-wrap flex-row gap-1.5'>
              <Text className='text-green font-mtblack'>
                {users ? users.length : 'brak'}
              </Text>
              <Text className='text-primary'>
                zarejestrowanych Użytkowników,
              </Text>
              <Text className='text-primary'>w tym</Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter(
                    (user) =>
                      Date.now() - user.registrationDate! <
                      1000 * 60 * 60 * 24 * 7,
                  ).length
                }
              </Text>
              <Text className='text-primary'>w ostatnich 7 dniach.</Text>
            </View>
            <View className='flex-wrap flex-row gap-1.5 mt-3'>
              <Text className='text-primary'>Najnowyszy Użytkownik: </Text>
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
              title='Zobacz wszystkich'
            />
          </>
        ) : null}
        {!postsLoading && posts ? (
          <>
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-green font-mtblack'>
                {posts ? posts.length : 'brak'}
              </Text>
              <Text className='text-primary'>postów,</Text>
              <Text className='text-primary'>w tym</Text>
              <Text className='text-green font-mtblack'>
                {
                  (posts as IPostsProps[]).filter(
                    (post) =>
                      Date.now() - new Date(post.createdAt).getTime() <
                      1000 * 60 * 60 * 24 * 7,
                  ).length
                }
              </Text>
              <Text className='text-primary'>w ostatnich 7 dniach.</Text>
            </View>
            <View className='flex-wrap flex-row gap-1.5 mt-3'>
              <Text className='text-primary'>Najnowyszy wpis: </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text className='text-secondary font-mtblack'>
                  {
                    (posts as IPostsProps[]).sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )[0].peak!.name
                  }{' '}
                  dodany przez{' '}
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
              <Text className='text-primary'>wpisów ukrytych.</Text>
            </View>
            <IconButton
              icon={icons.post}
              onPress={() => {}}
              title='Zobacz wszystkie'
            />
          </>
        ) : null}
        {!usersLoading && users ? (
          <>
            <View className='flex-wrap flex-row gap-1.5 mt-7'>
              <Text className='text-red font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) => user.isSuspended)
                    .length
                }
              </Text>
              <Text className='text-primary'>zawieszonych Użytkowników,</Text>
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
              <Text className='text-primary'>zablokowanych Użytkowników,</Text>
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
                Administracja
              </Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) => user.role?.id === 1)
                    .length
                }
              </Text>
              <Text className='text-primary'>Administratorów oraz</Text>
              <Text className='text-green font-mtblack'>
                {
                  (users as IUserProps[]).filter((user) => user.role?.id === 2)
                    .length
                }
              </Text>
              <Text className='text-primary'>Moderatorów</Text>
            </View>
            <IconButton
              icon={icons.appTeam}
              onPress={() => {}}
              title='Zobacz wszystkich'
            />
          </>
        ) : null}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default dashboard;
