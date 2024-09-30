import { ImageProps } from 'react-native';

export interface IUserProps {
  email: string | null;
  password: string | null;
}

export interface IRegisterProps extends IUserProps {
  username: string | null;
}

export interface IUserRequireProps extends IRegisterProps {
  id: string | null;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  joinAt: Date | null;
  description?: string;
}

export interface ITabIconProps {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}

export interface IPeakProps {
  id: string;
  name: string;
  height: string;
  description: string;
  trial: string;
  localizationLat: number;
  LocalizationLng: number;
  image: string;
}

export interface IPostsProps {
  id: string;
  author: IUserRequireProps;
  createdAt: Date;
  notes: string;
  photo: string;
  peak: IPeakProps;
}

export interface IRoleTypes {
  id: number;
  name: string;
  type: string;
}
