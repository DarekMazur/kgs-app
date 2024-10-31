import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import { editUser } from '@/lib/getDataFromApi';
import { pl } from '@/lang';
import { IMessageTypes } from '@/lib/types';
import { useGlobalContext } from '@/context/GlobalProvider';

const Messages = () => {
  const { user, setGlobalUser } = useGlobalContext();

  const messageAlert = async (message: IMessageTypes) => {
    const userUpdatedData = {
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
    };
    Alert.alert(pl.alert.warning, message.message);

    if (user) {
      await editUser(userUpdatedData);
      setGlobalUser(userUpdatedData);
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
