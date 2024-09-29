import { Text, View, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import posts from '@/lib/mockData/posts';
import PostCard from '@/components/PostCard';
import Recent from '@/components/Recent';
import { IUserRequireProps } from '@/lib/types';

const greetings = (user: IUserRequireProps) => {
  if (user.firstName || user.lastName) {
    return `${user.firstName ? `${user.firstName} ` : null}${user.lastName}`;
  }

  return user.username;
};

export const home = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <FlatList
        data={posts.filter((post) => post.author.id === user.id)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            author={item.author.firstName ?? item.author.username}
            date={item.createdAt}
            title={item.peak.name}
            photoUrl={item.photo}
          />
        )}
        ListHeaderComponent={() => (
          <View className='flex my-6 px-4 space-y-6'>
            <View className='flex justify-between items-start flex-row mb-6'>
              <View>
                <Text className='text-xl text-primary'>
                  Cześć,{'\n'}
                  <Text className='text-3xl text-red font-mtsemibold'>
                    {greetings(user)}
                  </Text>{' '}
                </Text>
                <Text className='text-primary text-xl'>witaj ponownie</Text>
              </View>
              <View>
                <Image
                  source={images.logoW}
                  className='w-20 h-20'
                  resizeMode='contain'
                />
              </View>
            </View>
            <View>
              <Text className='text-xl text-secondary text-center'>
                Ostatnio zdobyte:
              </Text>
              <Recent recentPosts={[posts[0], posts[1], posts[2]]} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className='flex justify-center items-center px-4'>
            <Text className='text-sm font-mtmedium text-gray-100'>
              Lorem Ipsum
            </Text>
            <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
              Dolor sit amet
            </Text>

            <ButtonCustom
              title='Back to Explore'
              handlePress={() => router.push('/home')}
              containerStyles='w-full my-5'
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default home;
