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
import { IUserProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import { icons } from '@/constants';
import { editUser, getSingleUser } from '@/lib/getDataFromApi';
import Footer from '@/components/Footer';
import { pl } from '@/lang';

const profileEdit = () => {
  const { user, setGlobalUser } = useGlobalContext();
  const [editedUser, setEditedUser] = useState<IUserProps>(user);

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
        Alert.alert(pl.profile.edit.alert.cancel);
      }, 100);
    }
  };

  const handleRemoveAvatar = () => {
    setEditedUser({
      ...editedUser,
      avatar: undefined,
    });
  };

  const handleSave = async () => {
    try {
      await editUser({
        ...user,
        ...editedUser,
      });
      const updatedUser = await getSingleUser(user.id as string);
      setGlobalUser(updatedUser[0]);
      Alert.alert(pl.alert.success, pl.profile.edit.alert.update.success);
      router.push('/profile');
    } catch (err) {
      Alert.alert(
        pl.alert.error,
        `${pl.profile.edit.alert.update.error} ${(err as Error).message}`,
      );
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG'>
      <ScrollView className='m-4'>
        <View className='h-full'>
          <View className='justify-center items-center mt-6 mb-12 px-4'>
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
            {pl.profile.edit.form.title}
          </Text>
          <View className='w-full my-2 pb-4'>
            <InputCustom
              placeholder={pl.profile.edit.form.username}
              title={pl.profile.edit.form.username}
              value={editedUser.username ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, username: e })
              }
            />

            <InputCustom
              placeholder={pl.profile.edit.form.email}
              title={pl.profile.edit.form.email}
              mode='email'
              isReadOnly
              value={editedUser.email ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, email: e })
              }
            />

            <InputCustom
              placeholder={pl.profile.edit.form.password}
              value={editedUser.password ?? ''}
              title={pl.profile.edit.form.password}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, password: e })
              }
              isPassword
              defaultValue={undefined}
            />

            <View className='mt-7 space-y-2'>
              <Text className='text-base text-gray-100 font-pmedium'>
                {pl.profile.edit.form.avatar}
              </Text>

              <TouchableOpacity onPress={openPicker}>
                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center'>
                  <View className='w-20 h-20 border border-dashed border-secondary-100 flex justify-center items-center'>
                    <Image
                      source={
                        editedUser.avatar
                          ? { uri: editedUser.avatar }
                          : icons.upload
                      }
                      resizeMode='cover'
                      alt='upload'
                      className='w-full h-full'
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ButtonCustom
                title={pl.profile.edit.form.removeAvatar}
                handlePress={handleRemoveAvatar}
                isLoading={false}
              />
            </View>

            <InputCustom
              placeholder={pl.profile.edit.form.name}
              title={pl.profile.edit.form.name}
              value={editedUser.firstName ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, firstName: e })
              }
            />

            <InputCustom
              placeholder={pl.profile.edit.form.lastName}
              title={pl.profile.edit.form.lastName}
              value={editedUser.lastName ?? ''}
              hint='next'
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, lastName: e })
              }
            />

            <InputCustom
              placeholder={pl.profile.edit.form.description}
              title={pl.profile.edit.form.description}
              value={editedUser.description ?? ''}
              handleOnChange={(e: string) =>
                setEditedUser({ ...editedUser, description: e })
              }
              isMultiline
            />
          </View>

          <ButtonCustom
            title={pl.profile.edit.form.submit}
            handlePress={handleSave}
            containerStyles='mt-7'
            isLoading={false}
          />
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default profileEdit;
