import { Image, TextInput, View } from 'react-native';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { colors, icons } from '@/constants';

interface ISearchProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const SearchInput: FC<ISearchProps> = ({ searchQuery, setSearchQuery }) => {
  const [query, setQuery] = useState<string>(searchQuery);
  return (
    <View className='flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary'>
      <TextInput
        className='text-base mt-0.5 text-primary flex-1 font-mtregular'
        value={query}
        placeholder='Szukaj szczytu'
        placeholderTextColor={colors.gray.v100}
        onChangeText={(e) => setQuery(e)}
        onBlur={() => setSearchQuery(query)}
      />
      <Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
    </View>
  );
};

export default SearchInput;
