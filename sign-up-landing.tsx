import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { images } from '@/constants';
import { pl } from '@/lang';
import ButtonCustom from '@/components/ButtonCustom';

const signUpLandingScreen = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <View className='items-center justify-center'>
        <Image
          source={images.logoW}
          resizeMode='contain'
          className='w-[115px] h-[115px]'
        />
      </View>
      <Text className='text-2xl text-white mt-10 font-mtemibold'>
        {pl.sign.landing.title}
      </Text>
      <Text className='text-white my-6'>{pl.sign.landing.message}</Text>
      <ButtonCustom
        title='Wróć'
        handlePress={() => router.push('/sign-in')}
      />{' '}
    </SafeAreaView>
  );
};

export default signUpLandingScreen;
