import { Image, Text, View } from 'react-native';
import { FC } from 'react';

interface IPostCardProps {
  author: string;
  date: Date;
  title: string;
  photoUrl: string;
}

const PostCard: FC<IPostCardProps> = ({ author, date, title, photoUrl }) => {
  const formatedDate = date.toString();
  return (
    <View className='w-full pt-3 pb-10 px-5 m-3 bg-gray-100'>
      <Text className='text-center text-xl font-mtsemibold'>
        przez {author}
      </Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-[200px] h-[250px] self-center m-3'
        resizeMode='cover'
      />
      <View className='self-end items-end'>
        <Text className='py-2 text-3xl'>{title}</Text>
        <Text>{formatedDate}</Text>
      </View>
    </View>
  );
};

export default PostCard;
