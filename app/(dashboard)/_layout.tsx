import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { ITabIconProps } from '@/lib/types';
import { colors, icons } from '@/constants';

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
          tabBarLabel: 'Panel',
          title: 'Panel',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.gear}
              color={color}
              name='Panel'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='posts'
        options={{
          tabBarLabel: 'Wpisy',
          title: 'Wpisy',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.post}
              color={color}
              name='Wpisy'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='users'
        options={{
          tabBarLabel: 'Użytkownicy',
          title: 'Użytkownicy',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.defaultAvatar}
              color={color}
              name='Użytkownicy'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='team'
        options={{
          tabBarLabel: 'Zespół',
          title: 'Zespół',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.appTeam}
              color={color}
              name='Zespół'
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
