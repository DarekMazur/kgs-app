import { Image, Text, View } from 'react-native';
import { FC } from 'react';
import { router } from 'expo-router';
import { useRoute } from '@react-navigation/core';
import { formatDate } from '@/lib/helpers';
import { constants, icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import IconButton from '@/components/IconButton';

interface IPostCardProps {
  id: string;
  peakId: string;
  author?: string;
  authorId?: string;
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
  const route = useRoute();

  if (isHidden && authorId !== user.id) {
    return null;
  }

  return (
    <View className='w-[90%] pt-3 pb-10 m-3 mb-8 bg-gray-100 self-center rounded-2xl'>
      <View className='w-full flex-wrap flex-row items-center justify-center'>
        <Text className='text-center text-xl font-mtsemibold'>
          {author ? `przez ${author}` : title}
        </Text>
        {user.role.id === 1 &&
        author &&
        route.name !== 'profile' &&
        authorId ? (
          <IconButton
            icon={icons.teamUserEdit}
            iconStyle='m-3 h-6 w-6'
            onPress={() => router.push(`/admin/user/${authorId}`)}
            containerStyles='m-0 p-0'
          />
        ) : null}
      </View>
      <Image
        source={{ uri: photoUrl }}
        className='w-full h-[250px] self-center m-3 relative'
        resizeMode='cover'
      />
      {isHidden ? (
        <IconButton
          icon={icons.hidden}
          onPress={() => {}}
          iconStyle='m-3 h-9 w-9'
          containerStyles='absolute right-2 top-[20px]'
        />
      ) : null}
      <IconButton
        icon={icons.moreInfo}
        onPress={() => router.push(`/peak/${peakId}`)}
        iconStyle='m-3 h-9 w-9'
        containerStyles='absolute right-2 top-[220px]'
      />
      <View className='self-end items-end px-5'>
        {author ? (
          <Text className='py-2 text-4xl text-red font-obregular'>{title}</Text>
        ) : null}
        <Text className='pb-3 leading-5'>{notes}</Text>
        {user.role.id < 3 && author && route.name !== 'profile' ? (
          <IconButton
            icon={icons.teamPostEdit}
            onPress={() => router.push(`/admin/post/${id}`)}
            iconStyle='self-center my-3 h-[25px] w-[25px]'
            containerStyles='m-0 m-0'
          />
        ) : null}
        {date ? <Text className='italic'>{formatDate(date)}</Text> : null}
      </View>
      {isAuthor && !constants.suspensionConditions(user.suspensionTimeout) ? (
        <View className='px-5 mt-5 flex-row justify-end'>
          <IconButton
            icon={icons.edit}
            onPress={() => router.push(`/post/${id}`)}
            iconStyle='self-center my-3 h-[25px] w-[25px]'
            containerStyles='m-0 m-0'
          />
          <IconButton
            icon={icons.trash}
            onPress={() => onPress}
            iconStyle='self-center h-[25px] w-[25px]'
            containerStyles='m-0 m-0'
          />
        </View>
      ) : null}
    </View>
  );
};

export default PostCard;
