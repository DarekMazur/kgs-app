import { FlatList, View, ImageBackground, ViewToken } from 'react-native';
import { FC, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { IPostsProps } from '@/lib/types';

interface IRecentProps {
  recentPosts: Array<IPostsProps>;
}

interface ILatestProps {
  activeItem: string;
  item: IPostsProps;
}

const zoomIn = {
  0: {
    scale: 0.9,
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
    scale: 0.9,
  },
};

const LatestPost: FC<ILatestProps> = ({ activeItem, item }) => {
  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
    >
      <View className='relative flex justify-center items-center'>
        <ImageBackground
          source={{
            uri: item.photo,
          }}
          className='w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40'
          resizeMode='cover'
        />
      </View>
    </Animatable.View>
  );
};

const Recent: FC<IRecentProps> = ({ recentPosts }) => {
  const [activeItem, setActiveItem] = useState<string>(recentPosts[0].id);

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
      contentOffset={{ x: 170 }}
    />
  );
};

export default Recent;
