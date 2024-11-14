import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons, constants } from '@/constants';
import Footer from '@/components/Footer';
import { IPublicUser, IUsersFilters } from '@/lib/types';
import ButtonCustom from '@/components/ButtonCustom';
import Filters from '@/components/Filters';
import ScreenHeader from '@/components/ScreenHeader';
import IconButton from '@/components/IconButton';
import { pl } from '@/lang';
import inactiveDefault from '@/assets/icons/inactiveDefault.png';

const initFormBox = {
  isInTeam: true,
  isLatest: false,
  isSuspended: false,
  isBanned: false,
};

const usersPanel = () => {
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<IPublicUser[] | null>();
  const [formBox, setFormBox] = useState(initFormBox);
  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    setFilteredUsers(users as IPublicUser[]);
  }, [users]);

  useEffect(() => {
    if (filteredUsers) {
      if (formBox.isLatest) {
        setFilteredUsers(
          (users as IPublicUser[]).filter(
            (user) =>
              Date.now() - new Date(user.registrationDate).getTime() <
              constants.fullDayMilliseconds * 7,
          ),
        );
      }

      if (!formBox.isInTeam) {
        setFilteredUsers(filteredUsers.filter((user) => user.role?.id === 3));
      }

      if (formBox.isSuspended) {
        setFilteredUsers(
          filteredUsers.filter((user) =>
            constants.suspensionConditions(user.suspensionTimeout),
          ),
        );
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
        setFilteredUsers(users as IPublicUser[]);
      }
    }
  }, [formBox]);

  const setNewForm = (form: IUsersFilters) => {
    return setFormBox(form);
  };

  const filters = [
    {
      title: 'isInTeam',
      description: pl.admin.user.list.filters.team,
    },
    {
      title: 'isLatest',
      description: pl.admin.user.list.filters.latest,
    },
    {
      title: 'isSuspended',
      description: pl.admin.user.list.filters.suspended,
    },
    {
      title: 'isBanned',
      description: pl.admin.user.list.filters.banned,
    },
  ];

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={usersLoading} />
      {!usersLoading && filteredUsers ? (
        <FlatList
          ref={ref}
          data={filteredUsers as IPublicUser[]}
          keyExtractor={(item) => item.id!}
          renderItem={({ item, index }) => (
            <View className='p-5 m-3 border-b-2 border-primary'>
              <View className='w-full flex-row gap-x-4'>
                <Image
                  source={{ uri: (item as IPublicUser).avatar }}
                  className='w-14 h-14'
                  resizeMode='contain'
                />
                <View>
                  <View className='flex-row items-center gap-x-2'>
                    <Text
                      className={`${item.isBanned ? 'text-red line-through' : 'text-primary'} text-lg`}
                    >
                      {`${index + 1}. ${(item as IPublicUser).username}`}
                    </Text>
                    {constants.suspensionConditions(item.suspensionTimeout) ||
                    !item.isConfirmed ? (
                      <Image
                        source={icons.suspended}
                        className='w-5 h-5'
                        resizeMode='contain'
                      />
                    ) : !item.isConfirmed ? (
                      <Image
                        source={icons.inactiveDefault}
                        className='w-5 h-5'
                        resizeMode='contain'
                      />
                    ) : null}
                  </View>
                  <Text className='text-primary my-2'>
                    {`${(item as IPublicUser).firstName} ${(item as IPublicUser).lastName}`}
                  </Text>
                  <Text
                    className={`${(item as IPublicUser).role?.id < 3 ? 'text-green' : 'text-primary'} my-2 font-mtbold`}
                  >
                    {(item as IPublicUser).role?.name}
                  </Text>
                </View>
              </View>
              <IconButton
                icon={icons.editLight}
                onPress={() => router.push(`/admin/user/${item.id}`)}
                title='Edytuj'
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <ScreenHeader>
                <Text className='text-red text-3xl font-mtblack'>
                  {pl.admin.user.list.title}
                </Text>
              </ScreenHeader>
              <TouchableOpacity
                className='flex-row flex-wrap items-center gap-2.5 mb-8'
                onPress={() => router.push('/home')}
              >
                <Image
                  source={icons.logout}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
                <Text className='text-primary font-mtblack'>
                  {pl.admin.closePanel}
                </Text>
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
                {pl.admin.user.list.empty}
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
        setNewForm={(form) => setNewForm(form as IUsersFilters)}
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default usersPanel;
