import { TextInput, View, Text, TouchableOpacity, Image } from 'react-native';
import { FC, useState } from 'react';
import { colors, icons } from '@/constants';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className='my-3'>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View
        className={`"w-full p-3 my-1 border border-gray-100 rounded-md focus:border-secondary flex flex-row items-center ${isReadOnly ? 'bg-black-200' : ''}`}
      >
        <TextInput
          className={`flex-1 font-mtsemibold text-base ${isReadOnly ? 'text-gray-200' : 'text-primary'}`}
          value={value}
          readOnly={isReadOnly}
          placeholder={placeholder}
          placeholderTextColor={colors.gray.v100}
          onChangeText={handleOnChange}
          secureTextEntry={isPassword && !showPassword}
          inputMode={mode}
          keyboardType={mode === 'email' ? 'email-address' : 'default'}
          multiline={isMultiline}
          numberOfLines={4}
          enterKeyHint={hint}
          defaultValue={defaultValue}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.noVision}
              className='w-6 h-6'
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputCustom;
