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
    <View>
      <Text>przez {author}</Text>
      <Image
        source={{ uri: photoUrl }}
        className='w-[300px] h-[500px]'
        resizeMode='cover'
      />
      <Text>{formatedDate}</Text>
      <Text>{title}</Text>
    </View>
  );
};

export default PostCard;
