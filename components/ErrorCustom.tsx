import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { FC } from 'react';
import ButtonCustom from '@/components/ButtonCustom';

interface IErrorProps {
  message: string;
  buttonTitle: string;
  handlePress: () => void;
}

const ErrorCustom: FC<IErrorProps> = ({
  message,
  handlePress,
  buttonTitle,
}) => {
  return (
    <SafeAreaView className='bg-primaryBG text-primary w-full h-full items-center justify-center'>
      <Text className='text-2xl text-red text-center p-4'>{message}</Text>
      <ButtonCustom
        title={buttonTitle}
        handlePress={handlePress}
        containerStyles='w-[50%]'
      />
    </SafeAreaView>
  );
};

export default ErrorCustom;
