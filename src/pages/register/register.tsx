import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUserApiAsync } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';
import { TRegisterData } from '@api';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useForm<TRegisterData>({
    email: '',
    name: '',
    password: ''
  });
  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserApiAsync(values));
  };

  return (
    <RegisterUI
      errorText={error || undefined}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={setFieldValue('email')}
      setPassword={setFieldValue('password')}
      setUserName={setFieldValue('name')}
      handleSubmit={handleSubmit}
    />
  );
};
