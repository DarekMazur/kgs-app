import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FC } from 'react';

interface IIconButtonProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  title?: string;
  color?: string;
  iconStyle?: string;
  containerStyles?: string;
  isDisabled?: boolean;
}

const IconButton: FC<IIconButtonProps> = ({
  icon,
  onPress,
  title,
  color,
  containerStyles,
  iconStyle,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      className={`flex-row gap-x-2 mt-4 mb-10 items-center ${containerStyles}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Image
        source={icon}
        className={`h-8 w-8 ${iconStyle}`}
        resizeMode='contain'
      />
      {title ? (
        <Text
          className={`text-${isDisabled ? 'gray-100' : (color ?? 'secondary')} font-mtblack`}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default IconButton;
