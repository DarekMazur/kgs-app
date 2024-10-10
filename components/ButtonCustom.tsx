import { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface IButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const ButtonCustom: FC<IButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-green rounded-xl min-h-[62px] flex flex-row justify-center items-center mb-3 ${containerStyles} ${
        isLoading || isDisabled ? 'opacity-30' : ''
      }
      }`}
      disabled={isLoading || isDisabled}
    >
      <Text className={`text-primary font-mtsemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;
