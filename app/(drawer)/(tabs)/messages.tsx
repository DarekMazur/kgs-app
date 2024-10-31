import { View, Text, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import { editUser } from '@/lib/getDataFromApi';
import { pl } from '@/lang';
import { IMessageTypes } from '@/lib/types';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';

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
    <SafeAreaView className='bg-primaryBG text-primary h-full px-4 py-2'>
      <Header />
      {user ? (
        <FlatList
          data={user.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => messageAlert(item)}
              className='my-2 flex-row items-center gap-2'
            >
              <Image
                source={item.openedTime ? icons.envelopeOpen : icons.envelope}
                className='h-4 w-4'
                resizeMode='contain'
              />
              <Text
                className={`font-mtbold text-lg text-${item.priority === 1 ? 'red' : item.priority === 2 ? 'secondary' : 'primary'}`}
              >
                {item.header}
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View className='items-center justify-center my-3'>
              <Text className='text-xl text-primary'>{pl.messages.title}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className='items-center justify-center my-3'>
              <Text className='text-xl text-primary'>{pl.messages.empty}</Text>
            </View>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Messages;
