import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

const adminUserEdit = () => {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>User query: {query}</Text>
    </SafeAreaView>
  );
};

export default adminUserEdit;
