import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { images } from '@/constants';
import { pl } from '@/lang';
import ButtonCustom from '@/components/ButtonCustom';

const signLandingScreen = () => {
  return (
    <SafeAreaView>
      <View className='items-center justify-center'>
        <Image
          source={images.logoW}
          resizeMode='contain'
          className='w-[115px] h-[115px]'
        />
      </View>

      <View>
        <Text className='text-2xl text-white mt-10 font-mtemibold'>
          {pl.sign.landing.title}
        </Text>
        <Text className='text-white my-7'>{pl.sign.landing.message}</Text>
      </View>

      <ButtonCustom
        title={pl.sign.landing.back}
        handlePress={() => router.push('/sign-in')}
      />
    </SafeAreaView>
  );
};

export default signLandingScreen;
