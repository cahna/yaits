import produce from 'immer';
import {
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  USERNAME_CHANGED,
  REGISTER_FAILURE,
  REGISTER_FORM_LOADING,
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

/* eslint-disable default-case, no-param-reassign */
const registerPageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case USERNAME_CHANGED:
        draft.username = payload.username || '';
        break;
      case PASSWORD_CHANGED:
        draft.password = payload.password || '';

        if (draft.password !== draft.confirmPassword) {
          draft.passwordError = true;
          draft.confirmPasswordError = true;
        } else {
          draft.passwordError = false;
          draft.confirmPasswordError = false;
        }
        break;
      case CONFIRM_PASSWORD_CHANGED:
        draft.confirmPassword = payload.confirmPassword || '';

        if (draft.confirmPassword !== draft.password) {
          draft.confirmPasswordError = true;
          draft.passwordError = true;
        } else {
          draft.confirmPasswordError = false;
          draft.passwordError = false;
        }
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
