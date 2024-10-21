import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import useApi from '@/hooks/useApi';
import { editUser, getSingleUser } from '@/lib/getDataFromApi';
import { IUserProps } from '@/lib/types';
import Loader from '@/components/Loader';
import IconButton from '@/components/IconButton';
import { icons } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { formatDate } from '@/lib/helpers';

const adminUserEdit = () => {
  const { query } = useLocalSearchParams();
  const { data, loading } = useApi(() => getSingleUser(query as string));
  const [userData, setUserData] = useState<IUserProps | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setUserData((data as IUserProps[])[0]);
    }
  }, [data]);

  const handleSuspend = () => {
    if (userData) {
      Alert.alert(
        `Czy chcesz zawiesić Użytkownika ${userData?.username}?`,
        '',
        [
          {
            text: 'Anuluj',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                setIsLoading(true);
                await editUser({
                  ...userData,
                  isSuspended: !userData.isSuspended,
                });
                setUserData({
                  ...userData,
                  isSuspended: !userData.isSuspended,
                });
                setIsLoading(false);
              } catch (error) {
                Alert.alert('Błąd...', (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  const handleBan = () => {
    if (userData) {
      Alert.alert(
        `Czy chcesz zablokować Użytkownika ${userData?.username}?`,
        '',
        [
          {
            text: 'Anuluj',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              try {
                setIsLoading(true);
                await editUser({
                  ...userData,
                  isSuspended: false,
                  isBanned: !userData.isBanned,
                });
                setUserData({
                  ...userData,
                  isBanned: !userData.isBanned,
                  isSuspended: false,
                });
                setIsLoading(false);
              } catch (error) {
                Alert.alert('Błąd...', (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-5'>
      <Loader isLoading={loading || isLoading} />
      <ScrollView>
        {userData ? (
          <>
            <View>
              <Text className='text-primary text-xl font-mtblack'>{`${userData.firstName ? userData.firstName : null} ${userData.lastName ? userData.lastName : null} ${userData.firstName || userData.lastName ? '(' : null}${userData.username}${userData.firstName || userData.lastName ? ')' : null}`}</Text>
              <Text className='text-primary'>{userData.role?.name}</Text>
              <Image
                source={{ uri: userData.avatar }}
                className='w-[200px] h-[200px] my-4 rounded-lg self-center'
                resizeMode='cover'
              />
            </View>
            <Text className='text-primary mb-3'>{userData.description}</Text>
            <Text className='text-primary mb-3'>{`Zarejestrowany: ${formatDate(new Date(userData.registrationDate))}`}</Text>
            <View>
              {userData.posts?.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  className='py-2 flex-row gap-x-2'
                  onPress={() => {}}
                >
                  <Text className='text-primary'>- </Text>
                  <Text className='text-primary'>{post.notes}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}
        <View className='my-3'>
          <IconButton
            containerStyles='my-3'
            isDisabled={userData?.isBanned}
            icon={
              userData?.isSuspended || userData?.isBanned
                ? icons.suspended
                : icons.suspendedActive
            }
            onPress={handleSuspend}
            title={
              userData?.isSuspended
                ? 'Zdejmij zawieszenie'
                : 'Zawieś Użytkownika'
            }
          />
          <IconButton
            containerStyles='my-3'
            icon={userData?.isBanned ? icons.banned : icons.bannedActive}
            onPress={handleBan}
            title={userData?.isBanned ? 'Zdejmij bana' : 'Ban'}
          />
        </View>
        <ButtonCustom title='Wróć' handlePress={router.back} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default adminUserEdit;
