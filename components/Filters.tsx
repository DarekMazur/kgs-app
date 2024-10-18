import {
  Image,
  Modal,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { colors, icons } from '@/constants';
import ButtonCustom from '@/components/ButtonCustom';
import {
  IPostFiltersProps,
  ITeamFilterProps,
  IUsersFiltersProps,
} from '@/lib/types';

interface IFiltersProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  form: IPostFiltersProps | IUsersFiltersProps | ITeamFilterProps;
  setNewForm: (
    form: IPostFiltersProps | IUsersFiltersProps | ITeamFilterProps,
  ) => void;
  filters: {
    title: string;
    description: string;
  }[];
}

const Filters: FC<IFiltersProps> = ({
  isModalOpen,
  setIsModalOpen,
  form,
  setNewForm,
  filters,
}) => {
  const [currentFormBox, setCurrentFormBox] = useState<
    IPostFiltersProps | IUsersFiltersProps | ITeamFilterProps
  >(form);

  const handleClose = (isCurrent: boolean) => {
    const newForm = isCurrent ? currentFormBox : form;
    setNewForm(newForm as IPostFiltersProps);
  };

  return (
    <Modal
      animationType='slide'
      transparent
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
    >
      <View className='h-full relative bg-primaryBG justify-center p-5'>
        <TouchableOpacity
          onPress={() => {
            setIsModalOpen(false);
            handleClose(false);
            setCurrentFormBox(form);
          }}
          className='absolute top-20 right-6 w-full items-end mb-10'
        >
          <Image
            source={icons.close}
            resizeMode='contain'
            className='w-7 h-7'
          />
        </TouchableOpacity>
        {filters.map((filter) => (
          <View className='text-primary flex-row gap-x-2.5 my-4'>
            <Switch
              trackColor={{
                false: colors.gray.v200,
                true: colors.gray.v100,
              }}
              thumbColor={
                currentFormBox[filter.title as keyof typeof currentFormBox]
                  ? colors.gray.v200
                  : colors.black.v200
              }
              ios_backgroundColor={colors.gray.v100}
              onValueChange={() =>
                setCurrentFormBox({
                  ...currentFormBox,
                  [filter.title]:
                    !currentFormBox[
                      filter.title as keyof typeof currentFormBox
                    ],
                })
              }
              value={
                currentFormBox[filter.title as keyof typeof currentFormBox]
              }
            />
            <Text className='text-primary font-mtblack'>
              {filter.description}
            </Text>
          </View>
        ))}
        <ButtonCustom
          title='Zastosuj'
          handlePress={() => {
            handleClose(true);
            setIsModalOpen(false);
          }}
        />
      </View>
    </Modal>
  );
};

export default Filters;
