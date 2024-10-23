import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import useApi from '@/hooks/useApi';
import { getAllPeaks } from '@/lib/getDataFromApi';
import Loader from '@/components/Loader';
import PostCard from '@/components/PostCard';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { IPeakProps } from '@/lib/types';
import SearchInput from '@/components/SearchInput';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const peaksScreen = () => {
  const { data: peaks, loading } = useApi(getAllPeaks);
  const ref = useRef(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useScrollToTop(ref);

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full'>
      <Loader isLoading={loading} />
      <Header />
      {!loading ? (
        <FlatList
          ref={ref}
          data={
            searchQuery
              ? (peaks as IPeakProps[]).filter((peak) =>
                  peak.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
              : (peaks as IPeakProps[])
          }
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
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-sm font-mtmedium text-gray-100'>
                Szukasz {searchQuery}?
              </Text>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Takiego szczytu nie ma w Koronie Gór Świętokrzyskich
              </Text>

              <ButtonCustom
                title='Wyczyść'
                handlePress={() => setSearchQuery('')}
                containerStyles='w-full my-5'
              />
            </View>
          )}
          ListFooterComponent={() => <Footer />}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default peaksScreen;
