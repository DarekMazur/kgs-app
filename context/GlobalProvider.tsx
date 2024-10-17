import { createContext, FC, ReactElement, useContext, useState } from 'react';
import { IUserProps } from '@/lib/types';

export const initNewUser: IUserProps = {
  id: null,
  username: null,
  email: null,
  password: null,
  registrationDate: 0,
  isSuspended: false,
  isBanned: false,
  role: { id: 3, name: 'User', type: 'user' },
};

const initialContext = {
  user: initNewUser,
  setGlobalUser: (newUser: IUserProps) => {},
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<IUserProps>(initNewUser);

  const setGlobalUser = (newUser: IUserProps) => {
    setUser({ ...newUser });
  };

  return (
    <GlobalContext.Provider value={{ user, setGlobalUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
