import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import uuid from 'react-native-uuid';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import ButtonCustom from '@/components/ButtonCustom';
import { icons } from '@/constants';
import { createPost, getAllPeaks } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import ScrollView = Animated.ScrollView;
import getDistance from '@/lib/helpers/getDistance';

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

interface IDistancesArrayElem {
  id: string;
  name: string;
  dist: number;
}

const createScreen = () => {
  const { data: peaks, refetch } = useApi(getAllPeaks);
  const { user } = useGlobalContext();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const cameraRef = useRef(null);
  const [postData, setPostData] = useState(initialPostData);
  const [location, setLocation] = useState(null);
  const [distances, setDistances] = useState<IDistancesArrayElem[]>([]);

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Błąd...', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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

      if (location) {
        const allDistances = [];
        peaks.forEach((peak, index) => {
          const dist = getDistance(
            location.coords.latitude,
            location.coords.altitude,
            peak.localizationLat,
            peak.localizationLng,
          ).toFixed(2);

          const peakDistance = {
            id: peak.id,
            name: peak.name,
            dist,
          };

          allDistances.push(peakDistance);
        });
        const sorted = allDistances.sort((a, b) => a.dist - b.dist);
        setDistances(sorted);
      }
    }
  }, [peaks, location]);

  if (!permission) {
    return <SafeAreaView />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className='bg-primaryBG text-primary w-full'>
        <Text className='text-xl text-secondary text-center'>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </SafeAreaView>
    );
  }

  if (distances.length > 0 && distances[0].dist >= 0.5) {
    return (
      <SafeAreaView className='bg-primaryBG text-primary w-full h-full items-center justify-center'>
        <Text className='text-2xl text-red text-center p-4'>
          No peaks close enough!
        </Text>
        <ButtonCustom
          title='Go back'
          handlePress={() => router.back()}
          containerStyles='w-[50%]'
        />
      </SafeAreaView>
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
            <Text className='text-xl text-secondary text-center'>
              {distances.length > 0
                ? `Nearest peak: ${distances[0].name} (${distances[0].dist} km)`
                : null}
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
