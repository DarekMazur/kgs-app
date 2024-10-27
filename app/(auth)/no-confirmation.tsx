import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import ButtonCustom from '@/components/ButtonCustom';
import { pl } from '@/lang';

const noConfirmation = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>{pl.sign.confirm.title}</Text>
        <Text>{pl.sign.confirm.message}</Text>
        <Text>{pl.sign.confirm.spam}</Text>
      </View>
      <View>
        <ButtonCustom title={pl.sign.confirm.resend} handlePress={() => {}} />
        <ButtonCustom
          title={pl.sign.confirm.back}
          handlePress={() => router.push('/sign-in')}
        />
      </View>
    </SafeAreaView>
  );
};

export default noConfirmation;
