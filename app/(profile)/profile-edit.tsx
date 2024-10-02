import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import InfoBox from '@/components/InfoBox';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import { IUserRequireProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import { icons } from '@/constants';
import { editUser, getSingleUser } from '@/lib/getDataFromApi';

const profileEdit = () => {
  const { user, setGlobalUser } = useGlobalContext();
  const [editedUser, setEditedUser] = useState<IUserRequireProps>(user);

  useEffect(() => {
    setEditedUser({ ...editedUser, password: null });
  }, []);

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpg'],
    });

    if (!result.canceled) {
      setEditedUser({
        ...editedUser,
        avatar: result.assets[0].uri,
      });
    } else {
      setTimeout(() => {
        Alert.alert('Anulowano');
      }, 100);
    }
  };

  const handleSave = async () => {
    try {
      await editUser({
        ...user,
        ...editedUser,
      });
      const updatedUser = await getSingleUser(user.id as string);
      setGlobalUser(updatedUser[0]);
      Alert.alert('Sukces!', 'Dane zaktualizowano poprawnie');
      router.push('/profile');
    } catch (err) {
      Alert.alert(
        'Błąd...',
        `nie udało się zaktualizować: ${(err as Error).message}`,
      );
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
              defaultValue={undefined}
            />

            <View className='mt-7 space-y-2'>
              <Text className='text-base text-gray-100 font-pmedium'>
                Zdjęcie
              </Text>

              <TouchableOpacity onPress={openPicker}>
                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center'>
                  <View className='w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center'>
                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      alt='upload'
                      className='w-1/2 h-1/2'
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

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
          </View>

          <ButtonCustom
            title='Zapisz'
            handlePress={handleSave}
            containerStyles='mt-7'
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profileEdit;
