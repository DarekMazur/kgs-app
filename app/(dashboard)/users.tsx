import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons, images } from '@/constants';
import Footer from '@/components/Footer';
import { IUserProps, IUsersFiltersProps } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Filters from '@/components/Filters';

const initFormBox = {
  isInTeam: true,
  isLatest: false,
  isSuspended: false,
  isBanned: false,
};

const usersPanel = () => {
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<IUserProps[] | null>();
  const [formBox, setFormBox] = useState(initFormBox);
  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    setFilteredUsers(users as IUserProps[]);
  }, [users]);

  useEffect(() => {
    if (filteredUsers) {
      if (formBox.isLatest) {
        setFilteredUsers(
          (users as IUserProps[]).filter(
            (user) =>
              Date.now() - new Date(user.registrationDate).getTime() <
              1000 * 60 * 60 * 24 * 7,
          ),
        );
      }

      if (!formBox.isInTeam) {
        setFilteredUsers(filteredUsers.filter((user) => user.role?.id === 3));
      }

      if (formBox.isSuspended) {
        setFilteredUsers(filteredUsers.filter((user) => user.isSuspended));
      }

      if (formBox.isBanned) {
        setFilteredUsers(filteredUsers.filter((user) => user.isBanned));
      }

      if (
        !formBox.isLatest &&
        formBox.isInTeam &&
        !formBox.isSuspended &&
        !formBox.isBanned
      ) {
        setFilteredUsers(users as IUserProps[]);
      }
    }
  }, [formBox]);

  const setNewForm = (form: IUsersFiltersProps) => {
    return setFormBox(form);
  };

  const filters = [
    {
      title: 'isInTeam',
      description: 'Zespół',
    },
    {
      title: 'isLatest',
      description: 'Najnowsi Użytkownicy',
    },
    {
      title: 'isSuspended',
      description: 'Zawieszeni',
    },
    {
      title: 'isBanned',
      description: 'Zablokowani',
    },
  ];

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={usersLoading} />
      {!usersLoading && filteredUsers ? (
        <FlatList
          ref={ref}
          data={filteredUsers as IUserProps[]}
          keyExtractor={(item) => item.id!}
          renderItem={({ item, index }) => (
            <View className='w-full p-5 m-3 flex-row gap-x-4 border-b-2 border-primary'>
              <Image
                source={{ uri: (item as IUserProps).avatar }}
                className='w-14 h-14'
                resizeMode='contain'
              />
              <View>
                <View className='flex-row items-center gap-x-2'>
                  <Text
                    className={`${item.isBanned ? 'text-red line-through' : 'text-primary'} text-lg`}
                  >
                    {`${index + 1}. ${(item as IUserProps).username}`}
                  </Text>
                  {item.isSuspended ? (
                    <Image
                      source={icons.suspended}
                      className='w-5 h-5'
                      resizeMode='contain'
                    />
                  ) : null}
                </View>
                <Text className='text-primary my-2'>
                  {`${(item as IUserProps).firstName} ${(item as IUserProps).lastName}`}
                </Text>
                <Text
                  className={`${(item as IUserProps).role?.id < 3 ? 'text-green' : 'text-primary'} my-2 font-mtbold`}
                >
                  {(item as IUserProps).role?.name}
                </Text>
              </View>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <View className='flex justify-between items-center flex-row mb-2'>
                <View>
                  <Text className='text-red text-3xl font-mtblack'>
                    Użytkownicy
                  </Text>
                </View>
                <View>
                  <Image
                    source={images.logoW}
                    className='w-20 h-20'
                    resizeMode='contain'
                  />
                </View>
              </View>
              <TouchableOpacity
                className='flex-row flex-wrap items-center gap-2.5 mb-8'
                onPress={() => router.push('/home')}
              >
                <Image
                  source={icons.logout}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
                <Text className='text-primary font-mtblack'>Zamknij panel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='items-end justify-end mb-8'
                onPress={() => setIsModalOpen(true)}
              >
                <Image
                  source={icons.filter}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </>
          )}
          ListEmptyComponent={() => (
            <View className='flex justify-center items-center px-4'>
              <Text className='text-xl text-center font-mtsemibold text-primary mt-2'>
                Brak użytkowników...
              </Text>

              <ButtonCustom
                title='Wróc'
                handlePress={() => router.push('/dashboard')}
                containerStyles='w-full my-5'
              />
            </View>
          )}
          ListFooterComponent={() => <Footer />}
        />
      ) : null}
      <Filters
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        form={formBox}
        setNewForm={(form) => setNewForm(form as IUsersFiltersProps)}
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default usersPanel;
