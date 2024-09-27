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
  joinAt: number | null;
  description?: string;
}

export interface ITabIconProps {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}
