import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import uuid from 'react-native-uuid';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { useScrollToTop } from '@react-navigation/native';
import ButtonCustom from '@/components/ButtonCustom';
import { icons, images } from '@/constants';
import { createPost, getAllPeaks, getSinglePeak } from '@/lib/getDataFromApi';
import useApi from '@/hooks/useApi';
import { useGlobalContext } from '@/context/GlobalProvider';
import InputCustom from '@/components/InputCustom';
import { getDistance } from '@/lib/helpers';
import CameraCustom from '@/components/CameraCustom';
import ErrorCustom from '@/components/ErrorCustom';
import { IPeakProps, IPostsProps } from '@/lib/types';
import Loader from '@/components/Loader';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const initialPostData = {
  id: '',
  author: {
    id: '',
    username: '',
    firstName: '',
    avatar: '',
    isSuspended: false,
    isBanned: false,
    role: 3,
  },
  createdAt: new Date(Date.now()),
  notes: '',
  photo: '',
  peak: null,
  isHidden: false,
};

interface IDistancesArrayElem {
  id: string;
  name: string;
  dist: number;
}

const createScreen = () => {
  const { data: peaks, loading, reFetch } = useApi(getAllPeaks);
  const { user, setGlobalUser } = useGlobalContext();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [postData, setPostData] = useState(initialPostData);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [distances, setDistances] = useState<IDistancesArrayElem[]>([]);
  const [isDouble, setIsDouble] = useState<boolean>(false);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const ref = useRef(null);

  useScrollToTop(ref);

  const onRefresh = async () => {
    await reFetch();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Błąd...', 'Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onRefresh();

      return () => {
        setIsCameraActive(false);
        setIsDouble(false);
        setPostData(initialPostData);
        return <View />;
      };
    }, []),
  );

  useEffect(() => {
    if (!user.id) {
      router.replace('/sign-in');
    }
  }, [user]);

  useEffect(() => {
    if (user && distances.length > 0) {
      if (user.posts?.some((post) => post.peak?.id === distances[0].id)) {
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
            username: user.username as string,
            firstName: user.firstName as string,
            avatar: user.avatar as string,
            isSuspended: user.isSuspended as boolean,
            isBanned: user.isBanned as boolean,
            role: user.role.id as number,
          },
          createdAt: postData.createdAt,
          notes: postData.notes,
          photo: postData.photo,
          peak: peak[0],
          isHidden: false,
        });
      };

      getPeak();
    }
  }, [distances, peaks]);

  useEffect(() => {
    if (peaks) {
      if (location) {
        const allDistances: IDistancesArrayElem[] = [];
        (peaks as IPeakProps[]).forEach((peak) => {
          const dist = parseInt(
            getDistance(
              location.coords.latitude as number,
              location.coords.longitude as number,
              peak.localizationLat,
              peak.localizationLng,
            ).toFixed(2),
            10,
          );

          const peakDistance = {
            id: peak.id,
            name: peak.name,
            dist,
          };

          allDistances.push(peakDistance);
        });
        const sorted = allDistances.sort((a, b) => a.dist - b.dist);
        setDistances(sorted);
        setIsLoading(false);
      }
    }
  }, [location]);

  /*
  ##################################
   !!uncomment after testing!!
  ##################################
  */
  // if (!isLoading && distances[0].dist >= 0.5) {
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

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await (cameraRef.current as CameraView).takePictureAsync();
      setPostData({
        ...postData,
        photo: photo?.uri ?? images.imagePlaceholder,
      });
      setIsCameraActive(false);
    }
  };

  const handleCameraStatus = () => {
    setIsCameraActive((prevState) => !prevState);
  };

  const handleSave = async () => {
    await createPost(postData);

    setGlobalUser({
      ...user,
      posts: [...(user.posts as IPostsProps[]), postData],
    });

    router.push('/home');
  };

  const handleSwitchFlashMode = () => {
    setIsFlashActive((prevState) => !prevState);
  };

  if (!permission) {
    return <SafeAreaView />;
  }

  if (!permission.granted) {
    return (
      <ErrorCustom
        message='We need your permission to show the camera'
        buttonTitle='Grant permission'
        handlePress={requestPermission}
      />
    );
  }

  if (isDouble) {
    return (
      <ErrorCustom
        message='You was here already...'
        buttonTitle='Go back'
        handlePress={() => router.back()}
      />
    );
  }

  if (isCameraActive) {
    return (
      <CameraCustom
        cameraRef={cameraRef}
        takePicture={takePicture}
        handleCameraStatus={handleCameraStatus}
        isFlashActive={isFlashActive}
        handleSwitchFlashMode={handleSwitchFlashMode}
      />
    );
  }

  return (
    <View className='bg-primaryBG pt-5'>
      <Loader isLoading={loading || isLoading} />
      <ScrollView className='w-full' ref={ref}>
        <View className='min-h-screen mx-6'>
          <View className='items-center justify-center mt-8'>
            <Text className='text-3xl text-secondary text-center'>
              Dodaj wpis
            </Text>
            <Text className='text-xl text-primary text-center mb-3'>
              {!loading && !isLoading
                ? `Najbliższy szczyt: ${distances[0].name} (${distances[0].dist} km)`
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
            src={postData.photo ?? images.imagePlaceholder}
            className='w-[80%] h-[30%] self-center'
            resizeMode='contain'
          />
          <TouchableOpacity
            onPress={handleCameraStatus}
            className='rounded-3xl w-11 h-11 flex flex-row self-center justify-center items-center m-5'
          >
            <Image
              source={icons.camera}
              resizeMode='contain'
              className='w-11 h-11 m-3'
            />
          </TouchableOpacity>
          <View className='flex-row w-full justify-between'>
            <ButtonCustom
              title='Anuluj'
              handlePress={() => router.back()}
              containerStyles='bg-red w-[40%]'
            />
            <ButtonCustom
              title='Zapisz'
              handlePress={handleSave}
              isDisabled={!postData.photo || !postData.notes}
              containerStyles='w-[40%]'
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default createScreen;
