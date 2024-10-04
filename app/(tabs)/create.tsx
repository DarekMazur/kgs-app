import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import uuid from 'react-native-uuid';
import { router, useFocusEffect } from 'expo-router';
import ButtonCustom from '@/components/ButtonCustom';
import { icons } from '@/constants';
import { createPost, getAllPeaks } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import ScrollView = Animated.ScrollView;

const initialPostData = {
  id: '',
  author: {
    id: '',
    username: '',
    firstName: '',
    avatar: '',
  },
  createdAt: null,
  notes: '',
  photo: '',
  peak: null,
};

const createScreen = () => {
  const { data: peaks, refetch } = useApi(getAllPeaks);
  const { user } = useGlobalContext();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const cameraRef = useRef(null);
  const [postData, setPostData] = useState(initialPostData);

  const onRefresh = async () => {
    await refetch();
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();

      return () => {
        <View />;
      };
    }, []),
  );

  useEffect(() => {
    if (peaks) {
      const randomPeak = peaks[Math.floor(Math.random() * peaks.length)];
      setPostData({
        id: uuid.v4() as string,
        author: {
          id: user.id as string,
          username: user.username,
          firstName: user.firstName,
          avatar: user.avatar as string,
        },
        peak: randomPeak,
      });
    }
  }, [peaks]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text className='text-xl text-secondary text-center'>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPostData({ ...postData, photo: photo.uri });
    }
  };

  const handleCameraStatus = () => {
    setIsCameraActive((prevState) => !prevState);
  };

  const handleSave = async () => {
    await createPost(postData);
    setPostData(initialPostData);

    router.push('/home');
  };

  return (
    <SafeAreaView className='bg-primaryBG text-primary w-full'>
      <ScrollView className='min-h-full'>
        <View>
          <View className='items-center justify-center'>
            <Text className='text-xl text-secondary text-center'>
              Create new post
            </Text>
          </View>
          <InputCustom
            placeholder='Opis'
            title='Opis'
            value={postData.notes ?? ''}
            hint='next'
            handleOnChange={(e: string) => {
              setPostData({ ...postData, notes: e });
            }}
            isMultiline
          />
          <ButtonCustom
            title={`Turn ${isCameraActive ? 'off' : 'on'} Camera`}
            handlePress={handleCameraStatus}
          />
          {isCameraActive ? (
            <CameraView
              className='min-h-[50%] relative'
              facing={facing}
              ref={cameraRef}
            >
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
            </CameraView>
          ) : null}
        </View>
        <ButtonCustom title='Zapisz' handlePress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default createScreen;
