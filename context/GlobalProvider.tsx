import { createContext, FC, ReactElement, useContext, useState } from 'react';
import { IUserRequireProps } from '@/lib/types';

export const initNewUser: IUserRequireProps = {
  id: null,
  username: null,
  email: null,
  password: null,
  registrationDate: null,
  role: null,
};

const initialContext = {
  user: initNewUser,
  setGlobalUser: (newUser: IUserRequireProps) => {},
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<IUserRequireProps>(initNewUser);

  const setGlobalUser = (newUser: IUserRequireProps) => {
    setUser({ ...newUser });
  };

  return (
    <GlobalContext.Provider value={{ user, setGlobalUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
