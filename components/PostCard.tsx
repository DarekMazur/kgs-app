import { Image, Text, View, TouchableOpacity, Touchable } from 'react-native';
import { FC } from 'react';
import { router } from 'expo-router';
import { contain } from '@hapi/hoek';
import { formatDate } from '@/lib/helpers';
import { icons } from '@/constants';

interface IPostCardProps {
  id: string;
  peakId: string;
  author: string;
  date: Date;
  title: string;
  photoUrl: string;
  notes?: string;
  isAuthor?: boolean;
  onPress?: () => void;
}

const PostCard: FC<IPostCardProps> = ({
  id,
  peakId,
  author,
  date,
  title,
  notes,
  photoUrl,
  isAuthor,
  onPress,
}) => {
  return (
    <View className='w-[90%] pt-3 pb-10 m-3 mb-8 bg-gray-100 self-center rounded-2xl'>
      <Text className='text-center text-xl font-mtsemibold'>
        przez {author}
      </Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-full h-[250px] self-center m-3 relative'
        resizeMode='cover'
      />
      <TouchableOpacity
        className='absolute right-2 top-[240px]'
        onPress={() => router.push(`/peak/${peakId}`)}
      >
        <Image
          source={icons.moreInfo}
          className='w-9 h-9 m-3'
          resizeMode='contain'
        />
      </TouchableOpacity>
      <View className='self-end items-end px-5'>
        <Text className='py-2 text-4xl text-red font-obregular'>{title}</Text>
        <Text className='pb-3 leading-5'>{notes}</Text>
        <Text className='italic'>{formatDate(date)}</Text>
      </View>
      {isAuthor ? (
        <View className='px-5 mt-5 flex-row justify-end'>
          <TouchableOpacity onPress={() => router.push(`/post/${id}`)}>
            <Image
              source={icons.edit}
              className='w-[25px] h-[25px] self-center mx-3'
              resizeMode='contain'
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPress}>
            <Image
              source={icons.trash}
              className='w-[25px] h-[25px] self-center ml-3'
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default PostCard;
