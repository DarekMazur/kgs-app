import { Image, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView } from 'expo-camera';
import { FC, useState } from 'react';
import { icons } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';

interface ICameraProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cameraRef: any;
  takePicture: () => void;
  isCameraActive: boolean;
  handleCameraStatus: () => void;
  isFlashActive: boolean;
  handleSwitchFlashMode: () => void;
}

const CameraCustom: FC<ICameraProps> = ({
  cameraRef,
  takePicture,
  isCameraActive,
  handleCameraStatus,
  isFlashActive,
  handleSwitchFlashMode,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View className='bg-primaryBG text-primary w-full h-full pt-4'>
      <CameraView
        className='h-full relative'
        facing={facing}
        ref={cameraRef}
        flash={isFlashActive ? 'on' : 'off'}
      >
        <View className='mt-7'>
          <TouchableOpacity
            className='self-end items-center'
            onPress={toggleCameraFacing}
          >
            <Image
              source={icons.switchIcon}
              resizeMode='contain'
              className='w-8 h-8 m-3'
            />
          </TouchableOpacity>
          <TouchableOpacity
            className='self-end items-center'
            onPress={handleSwitchFlashMode}
          >
            <Image
              source={isFlashActive ? icons.flashActive : icons.flashInactive}
              resizeMode='contain'
              className='w-8 h-8 m-3'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className='absolute self-center items-center justify-center bottom-5 h-16 w-16 rounded-[50%] bg-primary border-2 border-primaryBG'
          onPress={takePicture}
        >
          <Image
            source={icons.cameraDark}
            resizeMode='contain'
            className='w-6 h-6'
          />
        </TouchableOpacity>
        <ButtonCustom
          title={`Turn ${isCameraActive ? 'off' : 'on'} Camera`}
          handlePress={handleCameraStatus}
        />
      </CameraView>
    </View>
  );
};

export default CameraCustom;
