import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initNewUser, useGlobalContext } from '@/context/GlobalProvider';
import { colors, constants, icons } from '@/constants';
import { pl } from '@/lang';

const DrawerLayout = () => {
  const { user, setGlobalUser } = useGlobalContext();

  // eslint-disable-next-line consistent-return
  const clearData = async () => {
    try {
      await AsyncStorage.setItem('jwt', '');
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    setGlobalUser(initNewUser);
    clearData();
    router.replace('/sign-in');
  };

  const DrawerComponent = () => {
    return (
      <DrawerContentScrollView style={{ backgroundColor: colors.primaryBG }}>
        <View className='my-3 mb-6'>
          <Image
            source={user.avatar ? { uri: user.avatar } : icons.defaultAvatar}
            className='w-[130px] h-[130px] rounded-full self-center'
            resizeMode='cover'
          />
          <Text className='self-center text-primary text-xl pt-5 font-mtblack'>
            {user.username}
          </Text>
        </View>
        <DrawerItem
          label={pl.menu.drawer.profile}
          onPress={() => router.push('/profile')}
          labelStyle={{
            color: colors.primary.default,
            fontSize: 18,
          }}
          icon={() => (
            <Image
              source={icons.profile}
              className='w-6 h-6'
              resizeMode='contain'
            />
          )}
        />
        {constants.suspensionConditions(user.suspensionTimeout) ? null : (
          <DrawerItem
            label={pl.menu.drawer.add}
            onPress={() => router.push('/(drawer)/(tabs)/create')}
            labelStyle={{
              color: colors.primary.default,
              fontSize: 18,
            }}
            icon={() => (
              <Image
                source={icons.add}
                className='w-6 h-6'
                resizeMode='contain'
              />
            )}
          />
        )}
        <DrawerItem
          label={pl.menu.drawer.profileEdit}
          onPress={() => router.push('/(profile)/profile-edit')}
          labelStyle={{
            color: colors.primary.default,
            fontSize: 18,
          }}
          icon={() => (
            <Image
              source={icons.editUser}
              className='w-6 h-6'
              resizeMode='contain'
            />
          )}
        />
        <View className='mt-5'>
          <DrawerItem
            label={pl.menu.drawer.logout}
            onPress={handleLogout}
            labelStyle={{
              color: colors.primary.default,
              fontSize: 18,
            }}
            icon={() => (
              <Image
                source={icons.logout}
                className='w-6 h-6'
                resizeMode='contain'
              />
            )}
          />
        </View>
        <View className='mt-8'>
          <DrawerItem
            label={pl.menu.drawer.mainPolicy}
            onPress={() => {
              router.replace('/kgs');
            }}
            labelStyle={{
              color: colors.primary.default,
              fontSize: 18,
            }}
            icon={() => (
              <Image
                source={icons.termsKGS}
                className='w-6 h-6'
                resizeMode='contain'
              />
            )}
          />
          <DrawerItem
            label={pl.menu.drawer.privacyPolicy}
            onPress={() => {
              router.replace('/app-terms');
            }}
            labelStyle={{
              color: colors.primary.default,
              fontSize: 18,
            }}
            icon={() => (
              <Image
                source={icons.terms}
                className='w-6 h-6'
                resizeMode='contain'
              />
            )}
          />
        </View>
        {user.role!.id < 3 ? (
          <View className='mt-8'>
            <DrawerItem
              label={pl.menu.drawer.dashboard}
              onPress={() => {
                router.replace('/dashboard');
              }}
              labelStyle={{
                color: colors.primary.default,
                fontSize: 18,
              }}
              icon={() => (
                <Image
                  source={icons.gear}
                  className='w-6 h-6'
                  resizeMode='contain'
                />
              )}
            />
          </View>
        ) : null}
      </DrawerContentScrollView>
    );
  };

  return (
    <GestureHandlerRootView>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={() => <DrawerComponent />}
      />
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
