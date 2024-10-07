import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
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
import { createPost, getAllPeaks, getSinglePeak } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import ScrollView = Animated.ScrollView;
import { getDistance } from '@/lib/helpers';
import CameraCustom from '@/components/CameraCustom';

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
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [postData, setPostData] = useState(initialPostData);
  const [location, setLocation] = useState(null);
  const [distances, setDistances] = useState<IDistancesArrayElem[]>([]);
  const [isDouble, setIsDouble] = useState<boolean>(false);

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
        setIsCameraActive(false);
        setPostData(initialPostData);
        return <View />;
      };
    }, []),
  );

  useEffect(() => {
    if (user && distances.length > 0) {
      if (user.posts.some((post) => post.peak.id === distances[0].id)) {
        setIsDouble(true);
      }
    }
    if (peaks && distances.length > 0) {
      const getPeak = async () => {
        const peak = await getSinglePeak(distances[0].id);
        setPostData({
          id: uuid.v4() as string,
          author: {
            id: user.id as string,
            username: user.username,
            firstName: user.firstName,
            avatar: user.avatar as string,
          },
          peak,
        });
      };

      getPeak();
    }
  }, [distances, peaks]);

  useEffect(() => {
    if (peaks) {
      if (location) {
        const allDistances: IDistancesArrayElem[] = [];
        peaks.forEach((peak) => {
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

  /*
  ##################################
   !!uncomment after testing!!
  ##################################
  */
  // if (distances.length > 0 && distances[0].dist >= 0.5) {
  //   return (
  //     <SafeAreaView className='bg-primaryBG text-primary w-full h-full items-center justify-center'>
  //       <Text className='text-2xl text-red text-center p-4'>
  //         No peaks close enough!
  //       </Text>
  //       <ButtonCustom
  //         title='Go back'
  //         handlePress={() => router.back()}
  //         containerStyles='w-[50%]'
  //       />
  //     </SafeAreaView>
  //   );
  // }

  if (isDouble) {
    return (
      <SafeAreaView className='bg-primaryBG text-primary w-full h-full items-center justify-center'>
        <Text className='text-2xl text-red text-center p-4'>
          You was here already...
        </Text>
        <ButtonCustom
          title='Go back'
          handlePress={() => router.back()}
          containerStyles='w-[50%]'
        />
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPostData({ ...postData, photo: photo.uri });
      setIsCameraActive(false);
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

  if (isCameraActive) {
    return (
      <CameraCustom
        cameraRef={cameraRef}
        takePicture={takePicture}
        isCameraActive={isCameraActive}
        handleCameraStatus={handleCameraStatus}
      />
    );
  }

  return (
    <View className='bg-primaryBG py-5'>
      <ScrollView className='m-4'>
        <View className='min-h-screen'>
          <View className='items-center justify-center my-4'>
            <Text className='text-3xl text-secondary text-center'>
              Create new post
            </Text>
            <Text className='text-xl text-primary text-center mb-3'>
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
          <Image
            src={postData.photo ?? icons.imagePlaceholder}
            alt=''
            className='w-[80%] h-[30%] self-center'
            resizeMode='contain'
          />
          <TouchableOpacity
            onPress={handleCameraStatus}
            className='bg-gray-50 rounded-xl h-[62px] w-[62px] flex flex-row self-center justify-center items-center m-5 p-3'
          >
            <Image
              src={icons.cameraDark}
              alt=''
              className='w-14 h-14'
              resizeMode='contain'
            />
          </TouchableOpacity>
          <ButtonCustom
            title='Zapisz'
            handlePress={handleSave}
            isDisabled={!postData.photo || !postData.notes}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default createScreen;
