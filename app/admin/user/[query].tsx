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
import DropDownPicker, {
  ItemType,
  ValueType,
} from 'react-native-dropdown-picker';
import useApi from '@/hooks/useApi';
import { editUser, getAllRoles, getSingleUser } from '@/lib/getDataFromApi';
import { IRoleTypes, IUserProps } from '@/lib/types';
import Loader from '@/components/Loader';
import IconButton from '@/components/IconButton';
import { icons, constants } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import { formatDate } from '@/lib/helpers';
import { useGlobalContext } from '@/context/GlobalProvider';

const suspendTime = [
  {
    label: 'Doba',
    value: 1,
  },
  {
    label: 'Tydzień',
    value: 7,
  },
  {
    label: 'Miesiąc',
    value: 30,
  },
];

const adminUserEdit = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { data: rolesData, loading: rolesLoading } = useApi(getAllRoles);
  const { data, loading } = useApi(() => getSingleUser(query as string));
  const [userData, setUserData] = useState<IUserProps | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendValue, setSuspendValue] = useState<number | null>(null);
  const [suspendItems, setSuspendItems] =
    useState<ItemType<ValueType>[]>(suspendTime);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType<ValueType>[]>([]);

  useEffect(() => {
    if (rolesData) {
      const rolesList: ItemType<ValueType>[] = [];

      (rolesData as IRoleTypes[]).forEach((role) => {
        rolesList.push({ label: role.name, value: role.type });

        setItems(rolesList);
      });
    }
  }, [rolesData]);

  useEffect(() => {
    if (data) {
      setUserData((data as IUserProps[])[0]);
      setValue((data as IUserProps[])[0].role.type);
    }
  }, [data]);

  // eslint-disable-next-line consistent-return
  const handleSuspend = () => {
    if (
      !suspendValue &&
      !constants.suspensionConditions(new Date(userData.suspensionTimeout))
    ) {
      Alert.alert('Błąd', 'Wybierz czas zawieszenia Użytkownika!');
      return false;
    }
    if (userData) {
      Alert.alert(
        `${constants.suspensionConditions(new Date(userData.suspensionTimeout)) ? `Czy chcesz zakończyć zawieszenie Użykownika ${userData?.username}?` : `Czy chcesz zawiesić Użytkownika ${userData?.username} na ${suspendValue} ${suspendValue === 1 ? 'dzień' : 'dni'}?`}`,
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
                const timeout = new Date(
                  Date.now() + constants.fullDayMilliseconds * suspendValue,
                );
                await editUser({
                  ...userData,
                  totalSuspensions: constants.suspensionConditions(
                    new Date(userData.suspensionTimeout),
                  )
                    ? userData.totalSuspensions
                    : userData.totalSuspensions + 1,
                  suspensionTimeout: constants.suspensionConditions(
                    new Date(userData.suspensionTimeout),
                  )
                    ? undefined
                    : timeout,
                });
                setSuspendValue(null);
                setUserData({
                  ...userData,
                  totalSuspensions: constants.suspensionConditions(
                    new Date(userData.suspensionTimeout),
                  )
                    ? userData.totalSuspensions
                    : userData.totalSuspensions + 1,
                  suspensionTimeout: constants.suspensionConditions(
                    new Date(userData.suspensionTimeout),
                  )
                    ? undefined
                    : timeout,
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
        `${
          userData.isBanned
            ? `Czy checsz odblokować Użytkownika ${userData?.username}?`
            : `Czy chcesz zablokować Użytkownika ${userData?.username}?`
        }`,
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
                  suspensionTimeout: undefined,
                  isBanned: !userData.isBanned,
                  role: (rolesData as IRoleTypes[]).filter(
                    (role) => role.id === 3,
                  )[0],
                });
                setValue('user');
                setUserData({
                  ...userData,
                  suspensionTimeout: undefined,
                  isBanned: !userData.isBanned,
                  role: (rolesData as IRoleTypes[]).filter(
                    (role) => role.id === 3,
                  )[0],
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

  const handleSaveRole = async () => {
    if (constants.suspensionConditions(new Date(userData.suspensionTimeout))) {
      return Alert.alert(
        'Użytkownik zablokowany',
        'Nie można zmienić roli zablokowanego Użytkownika',
      );
    }
    if (userData) {
      try {
        setIsLoading(true);
        await editUser({
          ...userData,
          role: (rolesData as IRoleTypes[]).filter(
            (role) => role.type === value,
          )[0],
        });
        setUserData({
          ...userData,
          role: (rolesData as IRoleTypes[]).filter(
            (role) => role.type === value,
          )[0],
        });
        setIsLoading(false);
      } catch (error) {
        Alert.alert('Błąd...', (error as Error).message);
      }
    }
  };

  useEffect(() => {
    if (user.role.id !== 1) {
      Alert.alert('Uwaga', 'nie masz dostępu do tej części aplikacji!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/home');
          },
        },
      ]);
    }
  }, []);

  return (
    <SafeAreaView className='bg-primaryBG h-full w-full p-7'>
      <Loader isLoading={loading || isLoading} />
      <ScrollView>
        {userData ? (
          <>
            <View>
              <Text className='text-primary text-xl font-mtblack'>{`${userData.firstName ? userData.firstName : null} ${userData.lastName ? userData.lastName : null} ${userData.firstName || userData.lastName ? '(' : null}${userData.username}${userData.firstName || userData.lastName ? ')' : null}`}</Text>
              <Text className='text-primary'>{userData.role?.name}</Text>
              {userData.isBanned ? (
                <Text className='text-red text-xl font-mtblack mb-3'>
                  Konto zablokowane
                </Text>
              ) : null}
              <Image
                source={{ uri: userData.avatar }}
                className='w-[200px] h-[200px] my-4 rounded-lg self-center'
                resizeMode='cover'
              />
            </View>
            <Text className='text-primary mb-3'>{userData.description}</Text>
            <Text className='text-primary mb-3'>{`Zarejestrowany: ${formatDate(new Date(userData.registrationDate))}`}</Text>
            {constants.suspensionConditions(userData.suspensionTimeout) ? (
              <Text className='text-red mb-3'>
                {`Konto zawieszone do ${formatDate(new Date(userData.suspensionTimeout))}`}
              </Text>
            ) : null}
            <Text className='text-primary mb-3'>{`Łącznie ostrzeżeń (zawieszeń): ${userData.totalSuspensions}`}</Text>
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
          </>
        ) : null}
        <DropDownPicker
          flatListProps={{
            nestedScrollEnabled: true,
            showsVerticalScrollIndicator: false,
            scrollEnabled: false,
          }}
          loading={rolesLoading}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          disabled={userData?.isBanned}
        />
        <ButtonCustom
          title='Zapisz nową rolę'
          handlePress={handleSaveRole}
          textStyles='text-sm'
          containerStyles='min-h-[40px] w-[200px] my-3 bg-blue-600'
          isDisabled={value && userData ? value === userData.role.type : true}
        />
        <View className='my-3 z-20'>
          <View className='mb-3 z-20'>
            <IconButton
              containerStyles='my-3'
              isDisabled={
                userData?.isBanned ||
                (!suspendValue &&
                  !constants.suspensionConditions(
                    new Date(userData?.suspensionTimeout),
                  ))
              }
              icon={
                constants.suspensionConditions(userData?.suspensionTimeout) ||
                userData?.isBanned
                  ? icons.suspended
                  : icons.suspendedActive
              }
              onPress={handleSuspend}
              title={
                constants.suspensionConditions(userData?.suspensionTimeout)
                  ? 'Zdejmij zawieszenie'
                  : 'Zawieś Użytkownika'
              }
            />
            <DropDownPicker
              flatListProps={{
                nestedScrollEnabled: true,
                showsVerticalScrollIndicator: false,
                scrollEnabled: false,
              }}
              placeholder='Czas zawieszenia'
              open={suspendOpen}
              value={suspendValue}
              items={suspendItems}
              setOpen={setSuspendOpen}
              setValue={setSuspendValue}
              setItems={setSuspendItems}
              disabled={
                userData?.isBanned ||
                constants.suspensionConditions(
                  new Date(userData?.suspensionTimeout),
                )
              }
            />
          </View>
          <IconButton
            containerStyles='my-3'
            icon={userData?.isBanned ? icons.banned : icons.bannedActive}
            onPress={handleBan}
            title={userData?.isBanned ? 'Zdejmij bana' : 'Ban'}
          />
        </View>
        <ButtonCustom
          title='Wróć'
          handlePress={router.back}
          containerStyles='my-3 z-10'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default adminUserEdit;
