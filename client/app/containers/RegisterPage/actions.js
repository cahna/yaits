import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  REQUEST_REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_FORM_LOADING,
} from './constants';

export const changeUsername = (username) => ({
  type: USERNAME_CHANGED,
  payload: { username },
});

export const changePassword = (password) => ({
  type: PASSWORD_CHANGED,
  payload: { password },
});

export const changeConfirmPassword = (confirmPassword) => ({
  type: CONFIRM_PASSWORD_CHANGED,
  payload: { confirmPassword },
});

export const submitRegister = ({ username, password, onStart, onFailure }) => ({
  type: REQUEST_REGISTER,
  payload: { username, password, onStart, onFailure },
});

export const registerFormLoading = (loading = true) => ({
  type: REGISTER_FORM_LOADING,
  payload: { loading },
});

export const registerSuccess = () => ({ type: REGISTER_SUCCESS });

export const registerFailure = (error = '') => ({
  type: REGISTER_FAILURE,
  payload: { error },
});
