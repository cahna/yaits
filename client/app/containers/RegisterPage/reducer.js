import { replace } from 'lodash/string';
import produce from 'immer';
import {
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  USERNAME_CHANGED,
  REGISTER_FAILURE,
  REGISTER_FORM_LOADING,
  MIN_USERNAME_LEN,
  MAX_USERNAME_LEN,
  MIN_PASSWORD_LEN,
} from './constants';

export const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  loading: false,
  registerError: false,
  usernameError: false,
  passwordError: false,
  confirmPasswordError: false,
};

const sanitizeUsername = (username = '') =>
  replace(username, /\s|[^a-z0-9.\-_]/i, '');

const showUsernameError = ({ username, password, confirmPassword }) =>
  (username.length < MIN_USERNAME_LEN || username.length > MAX_USERNAME_LEN) &&
  (password.length > 0 || confirmPassword.length > 0);

const showPasswordError = ({ password, confirmPassword }) =>
  password.length < MIN_PASSWORD_LEN && confirmPassword.length > 0;

const showConfirmPasswordError = ({ password, confirmPassword }) =>
  confirmPassword.length > 0 && confirmPassword !== password;

/* eslint-disable default-case, no-param-reassign */
const registerPageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case USERNAME_CHANGED:
        draft.username = sanitizeUsername(payload.username);
        draft.usernameError = showUsernameError(draft);
        break;
      case PASSWORD_CHANGED:
        draft.password = payload.password || '';
        draft.usernameError = showUsernameError(draft);
        draft.passwordError = showPasswordError(draft);
        draft.confirmPasswordError = showConfirmPasswordError(draft);
        break;
      case CONFIRM_PASSWORD_CHANGED:
        draft.confirmPassword = payload.confirmPassword || '';
        draft.usernameError = showUsernameError(draft);
        draft.passwordError = showPasswordError(draft);
        draft.confirmPasswordError = showConfirmPasswordError(draft);
        break;
      case REGISTER_FORM_LOADING:
        draft.loading = payload.loading;
        break;
      case REGISTER_FAILURE:
        draft.registerError = true;
        draft.loading = false;
        break;
    }
  });

export default registerPageReducer;
