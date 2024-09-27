export interface IUserProps {
  email: string | null;
  password: string | null;
}

export interface IRegisterProps extends IUserProps {
  username: string | null;
}
