export interface LoginForm  {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  confirm_password: string;
}
