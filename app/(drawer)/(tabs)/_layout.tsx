import { Tabs } from 'expo-router';
import { View, Image, Text, Alert } from 'react-native';
import { FC, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, constants, icons } from '@/constants';
import { ITabIconProps, IUserProps } from '@/lib/types';
import { useGlobalContext } from '@/context/GlobalProvider';
import { pl } from '@/lang';
import { currentUser } from '@/lib/getDataFromApi';

const TabIcon: FC<ITabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className='flex items-center justify-center gap-2'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />
      <Text
        className={`${focused ? 'font-mtsemibold' : 'font-mtregular'} text-xs`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { user } = useGlobalContext();
  const [liveUpdateUser, setLiveUpdateUser] = useState<IUserProps>();
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt');
      if (value !== null) {
        try {
          const current = await currentUser(value as string);
          setLiveUpdateUser(current);
          return false;
        } catch (err) {
          Alert.alert(pl.alert.error, (err as Error).message);
        }
      }
      return false;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (liveUpdateUser) {
      setUnreadMessages(
        liveUpdateUser.messages.filter((message) => !message.openedTime).length,
      );
    }
  }, [liveUpdateUser]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.gray.v100,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.black.v100,
          borderTopWidth: 1,
          borderTopColor: colors.black.v200,
          height: 95,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          tabBarLabel: pl.menu.tabs.home,
          title: pl.menu.tabs.home,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name={pl.menu.tabs.home}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='peaks'
        options={{
          tabBarLabel: pl.menu.tabs.peaks,
          title: pl.menu.tabs.peaks,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.mountain}
              color={color}
              name={pl.menu.tabs.peaks}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='ranking'
        options={{
          tabBarLabel: pl.menu.tabs.ranking,
          title: pl.menu.tabs.ranking,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.ranking}
              color={color}
              name={pl.menu.tabs.ranking}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='messages'
        options={{
          tabBarBadge: unreadMessages > 0 ? unreadMessages : undefined,
          tabBarLabel: pl.menu.tabs.messages,
          title: pl.menu.tabs.messages,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.envelope}
              color={color}
              name={pl.menu.tabs.messages}
              focused={focused}
            />
          ),
        }}
      />
      {constants.suspensionConditions(user.suspensionTimeout) ? null : (
        <Tabs.Screen
          name='create'
          options={{
            tabBarLabel: pl.menu.tabs.add,
            title: pl.menu.tabs.add,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.add}
                color={color}
                name={pl.menu.tabs.add}
                focused={focused}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
};

export default TabLayout;
