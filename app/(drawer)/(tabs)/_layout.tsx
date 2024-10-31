import { Tabs } from 'expo-router';
import { View, Image, Text } from 'react-native';
import { FC } from 'react';
import { colors, constants, icons } from '@/constants';
import { ITabIconProps } from '@/lib/types';
import { useGlobalContext } from '@/context/GlobalProvider';
import { pl } from '@/lang';

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
  const { user, unreadMessages } = useGlobalContext();

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
          tabBarBadge:
            unreadMessages && unreadMessages > 0 ? unreadMessages : undefined,
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
