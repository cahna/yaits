import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_FORM_LOADING,
} from './constants';

export const loginFormLoading = (loading = true) => ({
  type: LOGIN_FORM_LOADING,
  payload: { loading },
});

export const changeUsername = (username) => ({
  type: USERNAME_CHANGED,
  payload: { username },
});

export const changePassword = (password) => ({
  type: PASSWORD_CHANGED,
  payload: { password },
});

export const loginSuccess = (accessToken) => ({
  type: LOGIN_SUCCESS,
  payload: { accessToken },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { error },
});
