import { View, Text, Modal, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { IMessageTypes } from '@/lib/types';
import { icons } from '@/constants';
import { formatDate } from '@/lib/helpers';
import ButtonCustom from '@/components/ButtonCustom';
import { useGlobalContext } from '@/context/GlobalProvider';
import { editUser } from '@/lib/getDataFromApi';

const MessageModal = ({
  message,
  isModalOpen,
  setIsModalOpen,
}: {
  message: IMessageTypes;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { user, setGlobalUser } = useGlobalContext();

  const readMessage = {
    ...user,
    messages: [
      ...user.messages.filter((item) => item.id !== message.id),
      {
        id: message.id,
        priority: message.priority,
        header: message.header,
        message: message.message,
        sendTime: message.sendTime,
        openedTime: new Date(Date.now()),
      },
    ],
  };

  const unreadMessage = {
    ...user,
    messages: [
      ...user.messages.filter((item) => item.id !== message.id),
      {
        id: message.id,
        priority: message.priority,
        header: message.header,
        message: message.message,
        sendTime: message.sendTime,
        openedTime: null,
      },
    ],
  };

  const handleRead = async () => {
    await editUser(readMessage);
    setGlobalUser(readMessage);
  };

  useEffect(() => {
    if (isModalOpen && !message.openedTime) {
      handleRead();
    }
  }, [isModalOpen]);

  const handleUnread = async () => {
    await editUser(unreadMessage);
    setGlobalUser(unreadMessage);
  };

  return (
    <Modal
      animationType='slide'
      visible={isModalOpen}
      transparent
      onRequestClose={() => {
        setIsModalOpen(!isModalOpen);
      }}
    >
      <View className='bg-primaryBG h-full w-full justify-center p-5'>
        <View className='flex-row items-start gap-3 mb-5'>
          <Image
            source={icons.envelopeOpen}
            className='w-6 h-6'
            resizeMode='contain'
          />
          <Text className='flex-1 flex-wrap text-xl text-primary font-mtbold'>
            {message.header}
          </Text>
        </View>
        <View>
          <Text className='text-primary py-3'>
            Wysłano: {formatDate(new Date(message.sendTime))}
          </Text>
          <Text className='text-primary my-5'>{message.message}</Text>
        </View>
        <View className='flex-row my-5 justify-between'>
          <ButtonCustom
            title='Zamknij'
            handlePress={() => setIsModalOpen(false)}
            containerStyles='w-[45%]'
            textStyles='text-center text-base'
          />
          <ButtonCustom
            title='Oznacz jako nieprzeczytane'
            handlePress={() => {
              handleUnread();
              setIsModalOpen(false);
            }}
            containerStyles='w-[45%] bg-secondary'
            textStyles='text-center text-base text-gray-800'
          />
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;
