import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import Header from '@/components/Header';
import { currentUser, editUser } from '@/lib/getDataFromApi';
import { pl } from '@/lang';
import { formatDate } from '@/lib/helpers';
import { IMessageTypes, IUserProps } from '@/lib/types';

const Messages = () => {
  const [user, setUser] = useState<IUserProps | undefined>();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt');
      if (value !== null) {
        try {
          const current = await currentUser(value as string);
          setUser(current);
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

  const messageAlert = async (message: IMessageTypes) => {
    Alert.alert(pl.alert.warning, message.message);

    if (user) {
      await editUser({
        ...user,
        messages: [
          ...user.messages.filter((item) => item.id !== message.id),
          {
            id: message.id,
            priority: message.priority,
            header: message.header,
            message: message.message,
            sendTime: message.sendTime,
            openedTime: new Date(Date.now()),
          },
        ],
      });
    }
  };

  return (
    <SafeAreaView>
      <Header />
      {user ? (
        <FlatList
          data={user.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => messageAlert(item)}>
              <Text>{item.header}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View>
              <Text>Messages</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View>
              <Text>No messages</Text>
            </View>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Messages;
