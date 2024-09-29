import { Image, Text, View } from 'react-native';
import { FC } from 'react';
import { formatDate } from '@/lib/helpers';

interface IPostCardProps {
  author: string;
  date: Date;
  title: string;
  photoUrl: string;
}

const PostCard: FC<IPostCardProps> = ({ author, date, title, photoUrl }) => {
  return (
    <View className='w-[90%] pt-3 pb-10 px-5 m-3 mb-8 bg-gray-100 self-center'>
      <Text className='text-center text-xl font-mtsemibold'>
        przez {author}
      </Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-[200px] h-[250px] self-center m-3'
        resizeMode='cover'
      />
      <View className='self-end items-end'>
        <Text className='py-2 text-4xl text-red font-obregular'>{title}</Text>
        <Text>{formatDate(date)}</Text>
      </View>
    </View>
  );
};

export default PostCard;
