import { ImageProps } from 'react-native';

export interface IRole {
  id: number;
  name: string;
  type: string;
}

export interface IMessage {
  id: string;
  priority: number;
  header: string;
  message: string;
  sendTime: Date;
  openedTime: Date | null;
}

export interface ISignIn {
  email: string | null;
  password: string | null;
}

export interface IRegister extends ISignIn {
  username: string | null;
}

export interface IPublicPeak {
  id: string;
  name: string;
  height: number;
  description: string;
  trial: string;
  image: string;
  localizationLat: number;
  localizationLng: number;
}

export interface IPublicPost {
  id: string;
  notes: string;
  photo: string;
  peak: IPublicPeak;
  isHidden: boolean;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    firstName?: string;
    avatar: string;
    isSuspended: boolean;
    isBanned: boolean;
    role: number;
  };
}

export interface IPublicUser extends IRegister {
  id: string;
  avatar: string;
  description?: string;
  messages: IMessage[];
  firstName?: string;
  lastName?: string;
  isBanned: boolean;
  suspensionTimeout?: Date;
  totalSuspensions: number;
  isConfirmed: boolean;
  posts: IPublicPost[];
  registrationDate: Date;
  role: IRole;
}

export interface IOptions {
  email: string;
  text: string;
  html: string;
  subject: string;
}

export interface ITabIcon {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}

export interface IPostFilters {
  isLatest: boolean;
  isHidden: boolean;
  isSuspended: boolean;
  isBanned: boolean;
}

export interface IUsersFilters {
  isInTeam: boolean;
  isLatest: boolean;
  isSuspended: boolean;
  isBanned: boolean;
}
export interface ITeamFilter {
  showAdmin: boolean;
  showMods: boolean;
}
