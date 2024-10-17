import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

const adminPostEdit = () => {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>Post query: {query}</Text>
    </SafeAreaView>
  );
};

export default adminPostEdit;
