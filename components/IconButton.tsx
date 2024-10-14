import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FC } from 'react';

interface IIconButtonProps {
  icon: ImageSourcePropType;
  iconSize?: number;
  onPress: () => void;
  title?: string;
  color?: string;
}

const IconButton: FC<IIconButtonProps> = ({
  icon,
  iconSize,
  onPress,
  title,
  color,
}) => {
  return (
    <TouchableOpacity
      className='flex-row gap-x-2 mt-4 mb-10 items-center'
      onPress={onPress}
    >
      <Image
        source={icon}
        className={`h-${iconSize ?? '8'} w-${iconSize ?? '8'}`}
        resizeMode='contain'
      />
      {title ? (
        <Text className={`text-${color ?? 'secondary'} font-mtblack`}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default IconButton;
