import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import ButtonCustom from '@/components/ButtonCustom';
import { pl } from '@/lang';

const noConfirmation = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <View>
        <Text className='text-2xl font-mtsemibold text-white mt-5'>
          {pl.sign.confirm.title}
        </Text>
        <Text className='font-mtsemibold text-white mt-10'>
          {pl.sign.confirm.message}
        </Text>
        <Text className='font-mtsemibold text-white mt-10'>
          {pl.sign.confirm.spam}
        </Text>
      </View>
      <View>
        <ButtonCustom title={pl.sign.confirm.resend} handlePress={() => {}} />
        <ButtonCustom
          title={pl.sign.confirm.back}
          handlePress={() => router.push('/sign-in')}
          containerStyles='my-7'
        />
      </View>
    </SafeAreaView>
  );
};

export default noConfirmation;
