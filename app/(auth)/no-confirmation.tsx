import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import ButtonCustom from '@/components/ButtonCustom';
import { pl } from '@/lang';

const noConfirmation = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full p-6'>
      <View>
        <Text className='text-3xl font-mtsemibold text-secondary mt-5'>
          {pl.sign.confirm.title}
        </Text>
        <Text className='font-mtsemibold text-white mt-10'>
          {pl.sign.confirm.message}
        </Text>
        <Text className='font-mtsemibold text-white mt-10'>
          {pl.sign.confirm.spam}
        </Text>
      </View>
      <View className='items-center'>
        <ButtonCustom
          title={pl.sign.confirm.resend}
          handlePress={() => {}}
          containerStyles='w-[80%] mt-8 p-2'
        />
        <ButtonCustom
          title={pl.sign.confirm.back}
          handlePress={() => router.push('/sign-in')}
          containerStyles='w-[80%] my-7 bg-orange-600'
        />
      </View>
    </SafeAreaView>
  );
};

export default noConfirmation;
