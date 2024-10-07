import { Image, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView } from 'expo-camera';
import { useState } from 'react';
import { icons } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';

const CameraCustom = ({
  cameraRef,
  takePicture,
  isCameraActive,
  handleCameraStatus,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View className='bg-primaryBG text-primary w-full h-full'>
      <CameraView className='h-full relative' facing={facing} ref={cameraRef}>
        <TouchableOpacity
          className='self-end items-center'
          onPress={toggleCameraFacing}
        >
          <Image
            source={icons.switchIcon}
            resizeMode='contain'
            className='w-8 h-8 m-5'
          />
        </TouchableOpacity>
        <TouchableOpacity
          className='absolute self-center bottom-5 h-16 w-16 rounded-[50%] bg-primary border-2 border-primaryBG'
          onPress={takePicture}
        />
        <ButtonCustom
          title={`Turn ${isCameraActive ? 'off' : 'on'} Camera`}
          handlePress={handleCameraStatus}
        />
      </CameraView>
    </View>
  );
};

export default CameraCustom;
