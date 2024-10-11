import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ScrollView } from 'react-native';
import { faker } from '@faker-js/faker';
import { router } from 'expo-router';
import ButtonCustom from '@/components/ButtonCustom';

const kgsTerms = () => {
  return (
    <SafeAreaView className='bg-primaryBG h-full w-full py-4 px-5'>
      <ScrollView className='gap-3.5'>
        <Text className='text-primary text-2xl'>KGS Terms</Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <Text className='text-primary'>
          {faker.lorem.paragraphs({ min: 2, max: 4 }, '\n')}
        </Text>
        <ButtonCustom
          title='Wróc'
          handlePress={() => router.back()}
          containerStyles='mx-4 mt-5'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default kgsTerms;
