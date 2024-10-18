import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { getAllUsers } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader';
import { icons } from '@/constants';
import Footer from '@/components/Footer';
import { ITeamFilterProps, IUserProps } from '@/lib/types';
import Filters from '@/components/Filters';
import ScreenHeader from '@/components/ScreenHeader';

const usersPanel = () => {
  const { data: users, loading: usersLoading } = useApi(getAllUsers);
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formBox, setFormBox] = useState({ showAdmin: true, showMods: true });

  useScrollToTop(ref);

  const filters = [
    {
      title: 'showAdmin',
      description: 'Administratorzy',
    },
    {
      title: 'showMods',
      description: 'Moderatorzy',
    },
  ];

  const setNewForm = (form: ITeamFilterProps) => {
    return setFormBox(form);
  };

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-4'>
      <Loader isLoading={usersLoading} />
      <ScrollView ref={ref}>
        <ScreenHeader>
          <Text className='text-red text-3xl font-mtblack'>Zespół</Text>
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
        {formBox.showAdmin && (
          <Text className='text-green text-2xl font-mtblack'>
            Administratorzy
          </Text>
        )}
        {!usersLoading && users && formBox.showAdmin
          ? users
              .filter((user) => (user as IUserProps).role?.id === 1)
              .map((user, index) => (
                <View className='w-full p-5 m-3 flex-row gap-x-4 border-b-2 border-primary'>
                  <Image
                    source={{ uri: (user as IUserProps).avatar }}
                    className='w-14 h-14'
                    resizeMode='contain'
                  />
                  <View>
                    <Text className='text-primary text-lg'>
                      {`${index + 1}. ${(user as IUserProps).username}`}
                    </Text>
                    <Text className='text-primary my-2'>
                      {`${(user as IUserProps).firstName} ${(user as IUserProps).lastName}`}
                    </Text>
                  </View>
                </View>
              ))
          : null}
        {formBox.showMods && (
          <Text className='text-green text-2xl font-mtblack mt-5'>
            Moderatorzy
          </Text>
        )}
        {!usersLoading && users && formBox.showMods
          ? users
              .filter((user) => (user as IUserProps).role?.id === 2)
              .map((user, index) => (
                <View className='w-full p-5 m-3 flex-row gap-x-4 border-b-2 border-primary'>
                  <Image
                    source={{ uri: (user as IUserProps).avatar }}
                    className='w-14 h-14'
                    resizeMode='contain'
                  />
                  <View>
                    <Text className='text-primary text-lg'>
                      {`${index + 1}. ${(user as IUserProps).username}`}
                    </Text>
                    <Text className='text-primary my-2'>
                      {`${(user as IUserProps).firstName} ${(user as IUserProps).lastName}`}
                    </Text>
                  </View>
                </View>
              ))
          : null}
        <Footer />
      </ScrollView>
      <Filters
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        form={formBox}
        setNewForm={(form) => setNewForm(form as ITeamFilterProps)}
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default usersPanel;
