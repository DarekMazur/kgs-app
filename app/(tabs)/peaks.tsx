import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text } from 'react-native';

const peaksScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Text>Lorem ipsum</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default peaksScreen;
