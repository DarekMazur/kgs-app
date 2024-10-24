import { Tabs } from 'expo-router';
import { View, Image, Text } from 'react-native';
import { FC } from 'react';
import { colors, icons } from '@/constants';
import { ITabIconProps } from '@/lib/types';

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
          tabBarLabel: 'Główna',
          title: 'Główna',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name='Główna'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'Profil',
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name='Profil'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='peaks'
        options={{
          tabBarLabel: 'Szczyty',
          title: 'Szczyty',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.mountain}
              color={color}
              name='Szczyty'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='ranking'
        options={{
          tabBarLabel: 'Zdobywcy',
          title: 'Zdobywcy',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.ranking}
              color={color}
              name='Zdobywcy'
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          tabBarLabel: 'Nowy',
          title: 'Nowy',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.add}
              color={color}
              name='Nowy'
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
