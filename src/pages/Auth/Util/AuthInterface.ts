export interface LoginBody  {
  email: string;
  password: string;
}

export interface FirstAccessBody  {
  email: string;
}

export interface RegisterBody extends LoginBody {
  name: string;
  confirm_password: string;
}
