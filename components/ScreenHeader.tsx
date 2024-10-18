import { Image, View } from 'react-native';
import { ReactElement } from 'react';
import { images } from '@/constants';

const ScreenHeader = ({ children }: { children: ReactElement }) => {
  return (
    <View className='flex justify-between items-center flex-row mb-2'>
      {children}
      <View>
        <Image
          source={images.logoW}
          className='w-20 h-20'
          resizeMode='contain'
        />
      </View>
    </View>
  );
};

export default ScreenHeader;
