import { View, Text } from 'react-native';
import { FC } from 'react';

interface IInfoBoxProps {
  title: string;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
}

const InfoBox: FC<IInfoBoxProps> = ({
  title,
  subtitle,
  containerStyles,
  titleStyles,
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-mtsemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className='text-sm text-gray-100 text-center font-mtregular'>
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
