// mock api call
import { users } from '@/lib/mockData';

export const getUser = (email: string, password: string) => {
  const findUser = users.filter(
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
    username,
    email,
    password,
  };
};
