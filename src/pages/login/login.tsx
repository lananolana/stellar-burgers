import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserApiAsync } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const { values, setFieldValue } = useForm<TLoginData>({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserApiAsync(values));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={setFieldValue('email')}
      password={values.password}
      setPassword={setFieldValue('password')}
      handleSubmit={handleSubmit}
    />
  );
};
