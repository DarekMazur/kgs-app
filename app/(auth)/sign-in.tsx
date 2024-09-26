import { Text, ScrollView, View, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { images } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';

const signIn = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4 my-6'>
          <Image
            source={images.logoW}
            resizeMode='contain'
            className='w-[115px] h-[115px]'
          />

          <Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>
            Zdobywaj szczyty Korony Gór Świętokrzyskich
          </Text>

          <TextInput
            className='flex-1 text-white font-mtsemibold text-base'
            placeholder='Email'
            placeholderTextColor='#CDCDE0'
            onChangeText={() => {}}
          />

          <TextInput
            className='flex-1 text-white font-mtsemibold text-base'
            placeholder='Hasło'
            placeholderTextColor='#CDCDE0'
            secureTextEntry
            onChangeText={() => {}}
          />

          <ButtonCustom
            title='Zaloguj się'
            handlePress={() => {}}
            containerStyles='mt-7'
            isLoading={false}
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Nie masz konta?
            </Text>
            <Link
              href='./sign-up'
              className='text-lg font-psemibold text-secondary'
            >
              Zarejestruj się
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
