import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import Header from '@/components/Header';

const Messages = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView>
      <Header />
      <FlatList
        data={user.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.header}</Text>
          </View>
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
    </SafeAreaView>
  );
};

export default Messages;
