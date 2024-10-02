import {
  FlatList,
  View,
  ImageBackground,
  ViewToken,
  Image,
} from 'react-native';
import { FC, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { IPostsProps } from '@/lib/types';
import { icons } from '@/constants';

interface IRecentProps {
  recentPosts: Array<IPostsProps>;
}

interface ILatestProps {
  activeItem: string;
  item: IPostsProps;
}

const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};

const LatestPost: FC<ILatestProps> = ({ activeItem, item }) => {
  return (
    <Animatable.View
      className='mr-2'
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
    >
      <View className='relative flex justify-center items-center'>
        <ImageBackground
          source={{
            uri: item.photo,
          }}
          className='w-52 h-72 rounded-[33px] my-2 overflow-hidden shadow-lg shadow-black/40'
          resizeMode='cover'
        />
        <Image
          source={item.author.avatar ?? icons.defaultAvatar}
          className='w-12 h-12 absolute top-4 left-4 rounded-[50%] border-2 border-primaryBG'
          resizeMode='contain'
        />
      </View>
    </Animatable.View>
  );
};

const Recent: FC<IRecentProps> = ({ recentPosts }) => {
  const [activeItem, setActiveItem] = useState<string>(
    recentPosts[0]?.id ?? null,
  );

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={recentPosts}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <LatestPost activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
    />
  );
};

export default Recent;
