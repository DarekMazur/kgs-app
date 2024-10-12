import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Dashboard = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full w-full'>
      <Text className='text-red text-2xl font-mtblack text-center'>
        Dashboard
      </Text>
    </SafeAreaView>
  );
};

export default Dashboard;
