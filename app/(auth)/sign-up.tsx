import {
  Text,
  ScrollView,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { images, schema } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import InputCustom from '@/components/InputCustom';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';
import { IRegisterProps } from '@/lib/types';
import { createUser } from '@/lib/getDataFromApi';
import { pl } from '@/lang';

const signUp = () => {
  const { user } = useGlobalContext();
  const [newUser, setNewUser] = useState<IRegisterProps>(initNewUser);
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    if (user.id) {
      router.replace('/home');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (newUser.username && newUser.email && newUser.password) {
      if (!isChecked) {
        Alert.alert(pl.alert.error, pl.sign.up.alert.privacyConsent);
        return;
      }
      if (!schema.emailRegex.test(newUser.email)) {
        Alert.alert(pl.alert.error, pl.sign.up.alert.missingEmail);
        return;
      }
      try {
        const registeredUser = await createUser(
          newUser.username,
          newUser.email.toLowerCase(),
          newUser.password,
        );

        if (registeredUser) {
          Alert.alert(pl.alert.success, pl.alert.login);

          router.replace('/sign-in');
        }
      } catch (err) {
        Alert.alert(pl.alert.error, (err as Error).message);
      }
    } else {
      Alert.alert(pl.alert.warning, pl.sign.up.alert.missingData);
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full'>
      <ScrollView>
        <View className='w-full flex justify-center h-full px-4'>
          <View className='items-center justify-center'>
            <Image
              source={images.logoW}
              resizeMode='contain'
              className='w-[115px] h-[115px]'
            />
          </View>

          <Text className='text-2xl text-white mt-10 font-mtemibold'>
            {pl.sign.up.header}
          </Text>

          <View className='my-2 pb-4 relative'>
            <InputCustom
              placeholder={pl.sign.up.form.username}
              title={pl.sign.up.form.username}
              value={newUser.username ?? ''}
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, username: e })
              }
              hint='next'
            />

            <InputCustom
              placeholder={pl.sign.up.form.email}
              title={pl.sign.up.form.email}
              value={newUser.email ?? ''}
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, email: e })
              }
              mode='email'
              hint='next'
            />

            <InputCustom
              placeholder={pl.sign.up.form.password}
              value={newUser.password ?? ''}
              title={pl.sign.up.form.password}
              handleOnChange={(e: string) =>
                setNewUser({ ...newUser, password: e })
              }
              isPassword
              mode='email'
            />
            <View className='flex-row flex-wrap items-center gap-3.5 mt-4'>
              <Checkbox value={isChecked} onValueChange={setChecked} />
              <View className='flex-row flex-wrap gap-1.5'>
                <Text className='text-primary'>
                  {pl.sign.up.form.consent.header}
                </Text>
                <TouchableOpacity
                  className='mr-2'
                  onPress={() => router.push('/app-terms')}
                >
                  <Text className='text-secondary'>
                    {pl.sign.up.form.consent.privacyPolicy}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ButtonCustom
            title={pl.sign.up.form.submit}
            handlePress={handleSubmit}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={
              !newUser.username ||
              !newUser.email ||
              !newUser.password ||
              !isChecked
            }
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              {pl.sign.up.registered}
            </Text>
            <Link
              href='./sign-in'
              className='text-lg font-psemibold text-secondary'
            >
              {pl.sign.up.login}
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signUp;
