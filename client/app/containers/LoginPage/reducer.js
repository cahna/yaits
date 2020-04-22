import produce from 'immer';
import {
  PASSWORD_CHANGED,
  USERNAME_CHANGED,
  LOGIN_FAILURE,
  LOGIN_FORM_LOADING,
} from './constants';

export const initialState = {
  username: '',
  password: '',
  loading: false,
  loginError: false,
  usernameError: false,
  passwordError: false,
};

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case USERNAME_CHANGED:
        draft.username = payload.username || '';
        break;
      case PASSWORD_CHANGED:
        draft.password = payload.password || '';
        break;
      case LOGIN_FAILURE:
        draft.loginError = true;
        draft.loading = false;
        break;
      case LOGIN_FORM_LOADING:
        draft.loading = payload.loading;
        break;
    }
  });

export default loginPageReducer;
