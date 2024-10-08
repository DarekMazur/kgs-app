import { ImageProps } from 'react-native';

export interface IRoleTypes {
  id: number;
  name: string;
  type: string;
}

export interface IUserProps {
  email: string | null;
  password: string | null;
}

export interface IRegisterProps extends IUserProps {
  username: string | null;
}

export interface IPeakProps {
  id: string;
  name: string;
  height: number;
  description: string;
  trial: string;
  localizationLat: number;
  localizationLng: number;
  image: string;
}

export interface IPostsProps {
  id: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    avatar: string;
  };
  createdAt: Date;
  notes: string;
  photo: string;
  peak: IPeakProps | null;
}

export interface IUserRequireProps extends IRegisterProps {
  id: string | null;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  registrationDate: number | null;
  description?: string;
  role: IRoleTypes | null;
  posts?: IPostsProps[];
}

export interface ITabIconProps {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}
