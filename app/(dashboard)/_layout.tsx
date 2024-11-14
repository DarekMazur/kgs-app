import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { ITabIcon } from '@/lib/types';
import { colors, icons } from '@/constants';
import { pl } from '@/lang';

const TabIcon: FC<ITabIcon> = ({ icon, color, name, focused }) => {
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

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.gray.v100,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.black.v100,
          borderTopWidth: 1,
          borderTopColor: colors.black.v200,
          height: 95,
        },
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          tabBarLabel: pl.admin.menu.home,
          title: pl.admin.menu.home,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.gear}
              color={color}
              name={pl.admin.menu.home}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='posts'
        options={{
          tabBarLabel: pl.admin.menu.posts,
          title: pl.admin.menu.posts,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.post}
              color={color}
              name={pl.admin.menu.posts}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='users'
        options={{
          tabBarLabel: pl.admin.menu.users,
          title: pl.admin.menu.users,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.defaultAvatar}
              color={color}
              name={pl.admin.menu.users}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='team'
        options={{
          tabBarLabel: pl.admin.menu.team,
          title: pl.admin.menu.team,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.appTeam}
              color={color}
              name={pl.admin.menu.team}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
