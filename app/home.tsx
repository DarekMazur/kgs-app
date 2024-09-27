import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobalContext, initNewUser } from '@/context/GlobalProvider';

export const home = () => {
  const { setGlobalUser } = useGlobalContext();

  const handleLogout = () => {
    setGlobalUser(initNewUser);
    router.navigate('/');
  };

  return (
    <SafeAreaView>
      <Text className='text-3xl'>Home</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>LogOut</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default home;
