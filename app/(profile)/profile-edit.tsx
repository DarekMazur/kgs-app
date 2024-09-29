import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import InfoBox from '@/components/InfoBox';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import { IUserRequireProps } from '@/lib/types';
import { editUser } from '@/lib/connection';
import ButtonCustom from '@/components/ButtonCustom';
import { icons } from '@/constants';

const profileEdit = () => {
  const { user, setGlobalUser } = useGlobalContext();
  const [editedUser, setEditedUser] = useState<IUserRequireProps>(user);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSave = () => {
    if (editedUser.username && editedUser.email && editedUser.password) {
      try {
        const editedUserData = editUser({
          ...user,
          ...editedUser,
        });
        setSuccess(true);
        setGlobalUser(editedUserData);
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG'>
      <ScrollView className='m-4'>
        <View className='h-full'>
          <View className='justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              onPress={() => router.push('/menu')}
              className='flex w-full items-end mb-10'
            >
              <Image
                source={icons.bars}
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

            <InfoBox
              title={`${user.firstName} ${user.lastName} (${user.username})`}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />
          </View>
          <Text className='text-white text-center font-mtsemibold text-lg'>
            Edytuj informacje
          </Text>
          <View className='w-full my-2 pb-4'>
            <InputCustom
              placeholder='Nazwa użytkownika'
              title='Nazwa użytkownika'
              value={editedUser.username ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, username: e })
              }
            />

            <InputCustom
              placeholder='Email'
              title='Email'
              mode='email'
              isReadOnly
              value={editedUser.email ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, email: e })
              }
            />

            <InputCustom
              placeholder='Hasło'
              value={editedUser.password ?? ''}
              title='Hasło'
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, password: e })
              }
              isPassword
              mode='email'
            />

            <InputCustom
              placeholder='Imię'
              title='Imię'
              value={editedUser.firstName ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, firstName: e })
              }
            />

            <InputCustom
              placeholder='Nazwisko'
              title='Nazwisko'
              value={editedUser.lastName ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, lastName: e })
              }
            />

            <InputCustom
              placeholder='Opis'
              title='Opis'
              value={editedUser.description ?? ''}
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, description: e })
              }
              isMultiline
            />

            {error ? (
              <Text className='absolute bottom-0 w-full mt-2 font-mtbold text-red'>
                {error}
              </Text>
            ) : null}
            {success ? (
              <Text className='absolute bottom-0 w-full mt-2 font-mtbold text-green'>
                Aktualizacja udana!
              </Text>
            ) : null}
          </View>

          <ButtonCustom
            title='Zapisz'
            handlePress={handleSave}
            containerStyles='mt-7'
            isLoading={false}
            isDisabled={
              !editedUser.username || !editedUser.email || !editedUser.password
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profileEdit;
