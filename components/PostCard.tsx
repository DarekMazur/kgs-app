import { Image, Text, View } from 'react-native';
import { FC } from 'react';
import { formatDate } from '@/lib/helpers';

interface IPostCardProps {
  author: string;
  date: Date;
  title: string;
  photoUrl: string;
  notes?: string;
}

const PostCard: FC<IPostCardProps> = ({
  author,
  date,
  title,
  notes,
  photoUrl,
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
    </View>
  );
};

export default PostCard;
