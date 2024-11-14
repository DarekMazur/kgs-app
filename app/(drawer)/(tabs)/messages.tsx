import { View, Text, FlatList, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import Header from '@/components/Header';
import { pl } from '@/lang';
import { IMessage } from '@/lib/types';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import MessageModal from '@/components/MessageModal';

const Messages = () => {
  const { user } = useGlobalContext();
  const [currentMessage, setCurrentMessage] = useState<IMessage | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <SafeAreaView className='bg-primaryBG text-primary h-full px-4 py-2'>
      <Header />
      {currentMessage ? (
        <MessageModal
          message={currentMessage}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      ) : null}
      {user ? (
        <FlatList
          data={user.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCurrentMessage(item);
                setIsModalOpen(true);
              }}
              className='my-2 flex-row items-start gap-2'
            >
              <Image
                source={item.openedTime ? icons.envelopeOpen : icons.envelope}
                className='pt-6 h-4 w-4'
                resizeMode='contain'
              />
              <Text
                className={`flex-1 flex-wrap font-mtbold text-lg text-${item.priority === 1 ? 'red' : item.priority === 2 ? 'secondary' : 'primary'}`}
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
