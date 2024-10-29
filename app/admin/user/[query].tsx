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
import { pl } from '@/lang';

const suspendTime = [
  {
    label: pl.admin.user.dropdown.day,
    value: 1,
  },
  {
    label: pl.admin.user.dropdown.week,
    value: 7,
  },
  {
    label: pl.admin.user.dropdown.month,
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

  const handleActive = () => {
    if (userData) {
      Alert.alert(
        `${
          userData.isConfirmed
            ? `${pl.admin.user.alert.inactivateUser} ${userData?.username}?`
            : `${pl.admin.user.alert.activateUser} ${userData?.username}?`
        }`,
        '',
        [
          {
            text: pl.admin.user.alert.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: pl.admin.user.alert.confirm,
            onPress: async () => {
              try {
                setIsLoading(true);
                await editUser({
                  ...userData,
                  isConfirmed: !userData.isConfirmed,
                });
                setUserData({
                  ...userData,
                  isConfirmed: !userData.isConfirmed,
                });
                setIsLoading(false);
              } catch (error) {
                Alert.alert(pl.alert.error, (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  // eslint-disable-next-line consistent-return
  const handleSuspend = () => {
    if (
      !suspendValue &&
      !constants.suspensionConditions(userData?.suspensionTimeout)
    ) {
      Alert.alert(pl.alert.error, pl.admin.user.alert.errorSuspend);
      return false;
    }
    if (userData) {
      Alert.alert(
        `${constants.suspensionConditions(userData.suspensionTimeout) ? `${pl.admin.user.alert.removeSuspend} ${userData?.username}?` : `${pl.admin.user.alert.suspend} ${userData?.username} na ${suspendValue} ${suspendValue === 1 ? 'dzień' : 'dni'}?`}`,
        '',
        [
          {
            text: pl.admin.user.alert.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: pl.admin.user.alert.confirm,
            onPress: async () => {
              try {
                setIsLoading(true);
                const timeout = new Date(
                  Date.now() +
                    constants.fullDayMilliseconds * (suspendValue ?? 1),
                );
                await editUser({
                  ...userData,
                  totalSuspensions: constants.suspensionConditions(
                    userData.suspensionTimeout,
                  )
                    ? userData.totalSuspensions
                    : userData.totalSuspensions + 1,
                  suspensionTimeout: constants.suspensionConditions(
                    userData.suspensionTimeout,
                  )
                    ? undefined
                    : timeout,
                });
                setSuspendValue(null);
                setUserData({
                  ...userData,
                  totalSuspensions: constants.suspensionConditions(
                    userData.suspensionTimeout,
                  )
                    ? userData.totalSuspensions
                    : userData.totalSuspensions + 1,
                  suspensionTimeout: constants.suspensionConditions(
                    userData.suspensionTimeout,
                  )
                    ? undefined
                    : timeout,
                });
                setIsLoading(false);
              } catch (error) {
                Alert.alert(pl.alert.error, (error as Error).message);
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
            ? `${pl.admin.user.alert.removeBan} ${userData?.username}?`
            : `${pl.admin.user.alert.ban} ${userData?.username}?`
        }`,
        '',
        [
          {
            text: pl.admin.user.alert.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: pl.admin.user.alert.confirm,
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
                Alert.alert(pl.alert.error, (error as Error).message);
              }
            },
          },
        ],
      );
    }
  };

  // eslint-disable-next-line consistent-return
  const handleSaveRole = async () => {
    if (constants.suspensionConditions(userData?.suspensionTimeout)) {
      return Alert.alert(
        pl.admin.user.alert.alreadyBlocked,
        pl.admin.user.alert.roleUpdateError,
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
        Alert.alert(pl.alert.error, (error as Error).message);
      }
    }
  };

  useEffect(() => {
    if (user.role.id !== 1) {
      Alert.alert(pl.alert.warning, pl.admin.user.alert.accessDenied, [
        {
          text: pl.alert.confirm,
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
                  {pl.admin.user.banned}
                </Text>
              ) : null}
              <Image
                source={{ uri: userData.avatar }}
                className='w-[200px] h-[200px] my-4 rounded-lg self-center'
                resizeMode='cover'
              />
            </View>
            <Text className='text-primary mb-7'>{userData.description}</Text>
            <Text className='text-primary mb-3'>{`${pl.admin.user.registered} ${formatDate(new Date(userData.registrationDate))}`}</Text>
            {constants.suspensionConditions(userData.suspensionTimeout) ? (
              <Text className='text-red mb-3'>
                {userData.suspensionTimeout
                  ? `${pl.admin.user.suspend} ${formatDate(userData.suspensionTimeout)}`
                  : null}
              </Text>
            ) : null}
            <Text
              className={`text-${userData.isConfirmed ? 'primary' : 'red'} mb-3`}
            >{`${pl.admin.user.active.title} ${userData.isConfirmed ? pl.admin.user.active.active : pl.admin.user.active.inactive}`}</Text>
            <Text className='text-primary mb-3'>{`${pl.admin.user.totalSuspended} ${userData.totalSuspensions}`}</Text>
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
          disabledStyle={{
            opacity: 0.5,
          }}
        />
        <ButtonCustom
          title={pl.admin.user.roleSave}
          handlePress={handleSaveRole}
          textStyles='text-sm'
          containerStyles='min-h-[40px] w-[200px] my-3 bg-blue-600'
          isDisabled={value && userData ? value === userData.role.type : true}
        />
        <View className='my-3 z-20'>
          <View className='mb-3 z-20'>
            <IconButton
              containerStyles='my-3'
              isDisabled={userData?.isBanned}
              icon={userData?.isConfirmed ? icons.inactive : icons.active}
              onPress={handleActive}
              title={
                userData?.isConfirmed
                  ? pl.admin.user.inactivate
                  : pl.admin.user.activate
              }
            />
            <IconButton
              containerStyles='my-3'
              isDisabled={
                userData?.isBanned ||
                (!suspendValue &&
                  !constants.suspensionConditions(userData?.suspensionTimeout))
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
                  ? pl.admin.user.removeSuspension
                  : pl.admin.user.addSuspension
              }
            />
            <DropDownPicker
              flatListProps={{
                nestedScrollEnabled: true,
                showsVerticalScrollIndicator: false,
                scrollEnabled: false,
              }}
              placeholder={pl.admin.user.suspensionTime}
              open={suspendOpen}
              value={suspendValue}
              items={suspendItems}
              setOpen={setSuspendOpen}
              setValue={setSuspendValue}
              setItems={setSuspendItems}
              disabledStyle={{
                opacity: 0.5,
              }}
              disabled={
                userData?.isBanned ||
                constants.suspensionConditions(userData?.suspensionTimeout)
              }
            />
          </View>
          <IconButton
            containerStyles='my-3'
            icon={userData?.isBanned ? icons.banned : icons.bannedActive}
            onPress={handleBan}
            title={
              userData?.isBanned
                ? pl.admin.user.removeBan
                : pl.admin.user.addBan
            }
          />
        </View>
        <ButtonCustom
          title={pl.admin.user.back}
          handlePress={router.back}
          containerStyles='my-3 z-10'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default adminUserEdit;
