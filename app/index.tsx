import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  return (
    <SafeAreaView className='bg-primaryBG justify-center items-center h-full p-4 font-mtregular'>
      <Text className='text-primary text-2xl'>
        Open /app/index.tsx to start working{' '}
        <Text className='text-secondary font-mtblack'>on your app!</Text>
      </Text>
    </SafeAreaView>
  );
};

export default Index;
