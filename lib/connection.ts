// mock api call
import uuid from 'react-native-uuid';
import { IUserRequireProps } from '@/lib/types';
import users from '@/lib/mockData/users';

export const getUser = (email: string, password: string) => {
  const findUser: IUserRequireProps[] = users.filter(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (findUser.length === 0) {
    throw new Error('Nie znaleziono użytownika');
  }

  if (findUser[0].password !== password) {
    throw new Error('Niepoprawne hasło');
  }
  return findUser[0];
};

export const setUser = (username: string, email: string, password: string) => {
  const id = uuid.v4().toString();
  const joinAt = Date.now();
  if (
    users.filter((user) => user.email.toLowerCase() === email.toLowerCase())
      .length !== 0
  ) {
    throw new Error('Użytkownik takim adresie email już istnieje');
  }

  if (users.filter((user) => user.username === username).length !== 0) {
    throw new Error('Użytkownik takiej nazwie już istnieje');
  }

  return {
    id,
    username,
    email,
    password,
    joinAt,
  };
};

export const editUser = (user: IUserRequireProps) => {
  return {
    ...users.filter((singleUser) => singleUser.id === user.id),
    ...user,
  };
};
