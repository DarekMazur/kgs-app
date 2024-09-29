import { View, TouchableOpacity, Image, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import peaks from '@/lib/mockData/peaks';
import posts from '@/lib/mockData/posts';
import { percentage } from '@/lib/helpers';
import PostCard from '@/components/PostCard';

const profileScreen = () => {
  const { user, setGlobalUser, setIsLoggedIn } = useGlobalContext();

  const handleLogout = () => {
    setGlobalUser(initNewUser);
    setIsLoggedIn();
    router.replace('/sign-in');
  };

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
            notes={item.notes}
            photoUrl={item.photo}
            isAuthor
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full flex justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              onPress={handleLogout}
              className='flex w-full items-end mb-10'
            >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-green rounded-lg flex justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />
            </View>

            <View className='mt-5'>
              <Text className='text-white text-center font-mtsemibold text-lg'>
                {user.firstName} {user.lastName} ({user.username})
              </Text>
            </View>

            <View className='mt-5 flex flex-row'>
              <View className='mt-5'>
                <Text className='text-white text-center font-mtsemibold text-lg'>
                  Zdobytych szczytów:
                </Text>
                <Text className='text-sm text-gray-100 text-center font-mtregular'>
                  {posts.filter(
                    (post) => post.author.username === user.username,
                  ).length || 0}{' '}
                  (
                  {percentage(
                    posts.filter(
                      (post) => post.author.username === user.username,
                    ).length,
                    peaks.length,
                  )}
                  %)
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default profileScreen;
