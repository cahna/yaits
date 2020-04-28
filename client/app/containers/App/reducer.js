import produce from 'immer';
import { reject } from 'lodash/collection';
import { kebabCase } from 'lodash/string';

import {
  ACTIVE_USER_LOADED,
  CLOSE_TOAST,
  CREATED_NEW_TEAM,
  LOADED_ISSUES_FOR_TEAM,
  LOADING_ACTIVE_USER,
  LOCAL_REFRESH_TOKEN_NAME,
  LOCAL_TOKEN_NAME,
  LOGOUT_FAILED,
  LOGOUT_SUCCESS,
  REQUEST_LOGOUT,
  SHOW_TOAST,
  USER_LOGGED_IN,
} from './constants';

export const makeEmptyUser = () => ({
  username: null,
  uniqueId: null,
  teams: [],
});

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: makeEmptyUser(),
  teamIssues: {},
  accessToken: localStorage.getItem(LOCAL_TOKEN_NAME),
  refreshToken: localStorage.getItem(LOCAL_REFRESH_TOKEN_NAME),
  toasts: [],
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
        draft.refreshToken = null;
        draft.currentUser = makeEmptyUser();
        break;
      case LOGOUT_FAILED:
        draft.loading = false;
        draft.error = true;
        draft.accessToken = null;
        draft.refreshToken = null;
        draft.currentUser = makeEmptyUser();
        break;
      case USER_LOGGED_IN:
        draft.loading = false;
        draft.error = false;
        draft.accessToken = payload.accessToken;
        draft.refreshToken = payload.refreshToken;
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
      case CREATED_NEW_TEAM:
        draft.currentUser = {
          ...draft.currentUser,
          teams: [...draft.currentUser.teams, payload.newTeam],
        };
        break;
      case LOADED_ISSUES_FOR_TEAM:
        draft.teamIssues = {
          ...draft.teamIssues,
          [payload.teamSlug]: {
            loaded: Date.now(),
            data: payload.issues,
          },
        };
        break;
      case SHOW_TOAST:
        draft.toasts = [
          ...draft.toasts,
          {
            id: kebabCase(`${payload.title}-${Date.now()}`),
            title: payload.title,
            text: payload.text,
            color: payload.color,
            iconType: payload.iconType,
          },
        ];
        break;
      case CLOSE_TOAST:
        draft.toasts = reject(draft.toasts, (t) => t.id === payload.id);
        break;
    }
  });

export default appReducer;
