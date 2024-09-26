import { TextInput, View, Text } from 'react-native';
import { FC } from 'react';

interface IInputProps {
  placeholder: string;
  value: string;
  title: string;
  handleOnChange: (e: string) => void;
  isPassword?: boolean;
}

const InputCustom: FC<IInputProps> = ({
  placeholder,
  value,
  title,
  handleOnChange,
  isPassword,
}) => {
  return (
    <View className='my-3'>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View className='p-3 my-1 border border-gray-100 rounded-md'>
        <TextInput
          className='flex-1 text-primary font-mtsemibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#CDCDE0'
          onChangeText={handleOnChange}
          secureTextEntry={isPassword}
        />
      </View>
    </View>
  );
};

export default InputCustom;
