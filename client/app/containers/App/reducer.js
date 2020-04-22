import produce from 'immer';
import {
  LOCAL_TOKEN_NAME,
  REQUEST_LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  USER_LOGGED_IN,
  LOADING_ACTIVE_USER,
  ACTIVE_USER_LOADED,
} from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: {
    username: null,
    uniqueId: null,
  },
  activeTeam: {
    name: null,
    slug: null,
  },
  accessToken: localStorage.getItem(LOCAL_TOKEN_NAME),
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case REQUEST_LOGOUT:
        draft.loading = true;
        draft.error = false;
        break;
      case LOGOUT_SUCCESS:
        draft.loading = false;
        draft.error = false;
        draft.accessToken = null;
        draft.currentUser = {
          username: null,
          uniqueId: null,
        };
        break;
      case LOGOUT_FAILED:
        draft.loading = false;
        draft.error = true;
        draft.accessToken = null;
        draft.currentUser = {
          username: null,
          uniqueId: null,
        };
        break;
      case USER_LOGGED_IN:
        draft.loading = false;
        draft.error = false;
        draft.accessToken = payload.accessToken;
        break;
      case LOADING_ACTIVE_USER:
        draft.loading = true;
        break;
      case ACTIVE_USER_LOADED:
        draft.loading = false;
        draft.error = payload.error;

        if (payload.currentUser) {
          draft.currentUser = payload.currentUser;
        } else {
          draft.currentUser = initialState.currentUser;
          draft.accessToken = null;
          localStorage.removeItem(LOCAL_TOKEN_NAME);
        }
        break;
    }
  });

export default appReducer;
