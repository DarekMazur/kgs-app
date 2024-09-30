import { Image, Text, View, TouchableOpacity } from 'react-native';
import { FC } from 'react';
import { formatDate } from '@/lib/helpers';
import { icons } from '@/constants';

interface IPostCardProps {
  author: string;
  date: Date;
  title: string;
  photoUrl: string;
  notes?: string;
  isAuthor?: boolean;
}

const PostCard: FC<IPostCardProps> = ({
  author,
  date,
  title,
  notes,
  photoUrl,
  isAuthor,
}) => {
  return (
    <View className='w-[90%] pt-3 pb-10 m-3 mb-8 bg-gray-100 self-center rounded-2xl'>
      <Text className='text-center text-xl font-mtsemibold'>
        przez {author}
      </Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-full h-[250px] self-center m-3'
        resizeMode='cover'
      />
      <View className='self-end items-end px-5'>
        <Text className='py-2 text-4xl text-red font-obregular'>{title}</Text>
        <Text className='pb-3 leading-5'>{notes}</Text>
        <Text className='italic'>{formatDate(date)}</Text>
      </View>
      {isAuthor ? (
        <View className='px-5 mt-5 flex-row justify-end'>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={icons.edit}
              className='w-[25px] h-[25px] self-center mx-3'
              resizeMode='contain'
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
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
