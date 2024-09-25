import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { images } from '../constants';
import Button from '@/components/Button';

const Index = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}
      >
        <View className='w-full flex justify-center items-center h-full px-4'>
          <Image
            source={images.logoFullW}
            className='w-full h-[84px] m-6'
            resizeMode='contain'
          />

          <View className='relative mt-5'>
            <Text className='text-3xl text-white font-bold text-center'>
              Poznaj region{'\n'}i zachwyć się pięknem{' '}
              <Text className='text-red'>Gór Świętokrzyskich</Text>
            </Text>
          </View>

          <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
            Zdobywaj najwyższe szczyty w najstarszych polskich górach!
          </Text>

          <Button
            title='Zaloguj się'
            handlePress={() => router.push('./sign-in')}
            containerStyles='w-full mt-7'
            textStyles='text-2xl'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
