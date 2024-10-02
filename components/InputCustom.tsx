import { TextInput, View, Text } from 'react-native';
import { FC } from 'react';
import { colors } from '@/constants';

interface IInputProps {
  placeholder: string;
  value: string;
  title: string;
  mode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';
  handleOnChange: (e: string) => void;
  isPassword?: boolean;
  isMultiline?: boolean;
  isReadOnly?: boolean;
  hint?: 'enter' | 'done' | 'next' | 'search' | 'send';
  defaultValue?: string;
}

const InputCustom: FC<IInputProps> = ({
  placeholder,
  value,
  title,
  handleOnChange,
  isPassword,
  isMultiline,
  mode,
  isReadOnly,
  hint,
  defaultValue,
}) => {
  return (
    <View className='my-3'>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View
        className={`p-3 my-1 border border-gray-100 rounded-md ${isReadOnly ? 'bg-black-200' : ''}`}
      >
        <TextInput
          className={`flex-1 font-mtsemibold text-base ${isReadOnly ? 'text-gray-200' : 'text-primary'}`}
          value={value}
          readOnly={isReadOnly}
          placeholder={placeholder}
          placeholderTextColor={colors.gray.v100}
          onChangeText={handleOnChange}
          secureTextEntry={isPassword}
          inputMode={mode}
          keyboardType={mode === 'email' ? 'email-address' : 'default'}
          multiline={isMultiline}
          numberOfLines={4}
          enterKeyHint={hint}
          defaultValue={defaultValue}
        />
      </View>
    </View>
  );
};

export default InputCustom;
