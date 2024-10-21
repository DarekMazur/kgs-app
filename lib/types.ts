import { ImageProps } from 'react-native';

export interface IRoleTypes {
  id: number;
  name: string;
  type: string;
}

export interface ISignInProps {
  email: string | null;
  password: string | null;
}

export interface IRegisterProps extends ISignInProps {
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
    isSuspended: boolean;
    isBanned: boolean;
    role: number;
  };
  createdAt: Date;
  notes: string;
  photo: string;
  peak: IPeakProps | null;
  isHidden: boolean;
}

export interface IUserProps extends IRegisterProps {
  id: string | null;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  registrationDate: number;
  description?: string;
  role: IRoleTypes;
  posts?: IPostsProps[];
  isSuspended: boolean;
  isBanned: boolean;
}

export interface ITabIconProps {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}

export interface IPostFiltersProps {
  isLatest: boolean;
  isHidden: boolean;
  isSuspended: boolean;
  isBanned: boolean;
}

export interface IUsersFiltersProps {
  isInTeam: boolean;
  isLatest: boolean;
  isSuspended: boolean;
  isBanned: boolean;
}
export interface ITeamFilterProps {
  showAdmin: boolean;
  showMods: boolean;
}
