import { View, Text, Modal, Image } from 'react-native';
import { IMessageTypes } from '@/lib/types';
import { icons } from '@/constants';
import { formatDate } from '@/lib/helpers';
import ButtonCustom from '@/components/ButtonCustom';

const MessageModal = ({
  message,
  isModalOpen,
}: {
  message: IMessageTypes;
  isModalOpen: boolean;
}) => {
  return (
    <Modal
      className='bg-primatyBg h-full w-full'
      animationType='slide'
      transparent
      visible={isModalOpen}
    >
      <View className='flex-row items-center'>
        <Image source={icons.envelopeOpen} className='w-6 h-6' />
        <Text className='text-lg text-primary'>{message.header}</Text>
      </View>
      <View>
        <Text className='text-primary py-3'>
          Wysłano: {formatDate(new Date(message.sendTime))}
        </Text>
        <Text className='text-primary'>{message.message}</Text>
      </View>
      <View>
        <ButtonCustom title='Zamknij' handlePress={() => {}} />
        <ButtonCustom
          title='Oznacz jako nieprzeczytane'
          handlePress={() => {}}
        />
      </View>
    </Modal>
  );
};

export default MessageModal;
