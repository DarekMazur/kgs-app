import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, Text, View, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import useApi from '@/hooks/useApi';
import { getAllPeaks } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { colors, icons, images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { IPeakProps } from '@/lib/types';

const peaksScreen = () => {
  const { data: peaks, loading } = useApi(getAllPeaks);
  const ref = useRef(null);
  const [searchQuery, setSearchQuery] = useState<string>();

  useScrollToTop(ref);

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <Loader isLoading={loading} />
      {!loading ? (
        <FlatList
          ref={ref}
          data={peaks as IPeakProps[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              id={item.id}
              peakId={item.id}
              title={`${item.name} - ${item.height}m`}
              notes={item.trial}
              photoUrl={item.image}
            />
          )}
          ListHeaderComponent={() => (
            <View className='flex my-6 px-4 space-y-6'>
              <View className='flex justify-between items-start flex-row mb-6'>
                <View>
                  <Text className='text-2xl text-secondary'>
                    Korona Gór Śwętokrzyskich
                  </Text>
                  <Text className='text-primary text-xl'>
                    Szczyty do zdobycia
                  </Text>
                </View>

                <View>
                  <Image
                    source={images.logoW}
                    className='w-20 h-20'
                    resizeMode='contain'
                  />
                </View>
              </View>
              <View className='flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary'>
                <TextInput
                  className='text-base mt-0.5 text-primary flex-1 font-mtregular'
                  value={searchQuery}
                  placeholder='Szukaj szczytu'
                  placeholderTextColor={colors.gray.v100}
                  onChangeText={(e) => setSearchQuery(e)}
                />
                <Image
                  source={icons.search}
                  className='w-5 h-5'
                  resizeMode='contain'
                />
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
      ) : null}
    </SafeAreaView>
  );
};

export default peaksScreen;
