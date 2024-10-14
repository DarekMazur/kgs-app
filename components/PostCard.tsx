import { Image, Text, View, TouchableOpacity, Touchable } from 'react-native';
import { FC } from 'react';
import { router } from 'expo-router';
import { formatDate } from '@/lib/helpers';
import { icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';

interface IPostCardProps {
  id: string;
  peakId: string;
  author?: string;
  authorId: string;
  date?: Date;
  title: string;
  photoUrl: string;
  notes?: string;
  isAuthor?: boolean;
  onPress?: () => void;
  isHidden?: boolean;
}

const PostCard: FC<IPostCardProps> = ({
  id,
  peakId,
  author,
  authorId,
  date,
  title,
  notes,
  photoUrl,
  isAuthor,
  onPress,
  isHidden,
}) => {
  const { user } = useGlobalContext();

  if (isHidden && authorId !== user.id) {
    return null;
  }

  return (
    <View className='w-[90%] pt-3 pb-10 m-3 mb-8 bg-gray-100 self-center rounded-2xl'>
      <Text className='text-center text-xl font-mtsemibold'>
        {author ? `przez ${author}` : title}
      </Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-full h-[250px] self-center m-3 relative'
        resizeMode='cover'
      />
      {isHidden ? (
        <TouchableOpacity
          className='absolute right-2 top-[40px]'
          onPress={() => router.push(`/peak/${peakId}`)}
        >
          <Image
            source={icons.hidden}
            className='w-9 h-9 m-3'
            resizeMode='contain'
          />
        </TouchableOpacity>
      ) : null}
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
        {author ? (
          <Text className='py-2 text-4xl text-red font-obregular'>{title}</Text>
        ) : null}
        <Text className='pb-3 leading-5'>{notes}</Text>
        {date ? <Text className='italic'>{formatDate(date)}</Text> : null}
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
