import {Text} from "react-native";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className='bg-primaryBG justify-center items-center h-full p-4 font-mtregular'>
      <Text className='text-primary text-2xl'>Open /app/index.tsx to start working <Text className='text-secondary font-mtblack'>on your app!</Text></Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
