import produce from 'immer';
import { handleActions, combineActions } from 'redux-actions';
import { reject } from 'lodash/collection';

import { LOCAL_TOKEN_NAME, LOCAL_REFRESH_TOKEN_NAME } from './constants';
import {
  addErrorToast,
  addInfoToast,
  addSuccessToast,
  addToast,
  closeToast,
  notifyActiveUserLoaded,
  notifyActiveUserLoading,
  notifyCreatedTeam,
  notifyLogoutFailed,
  notifyLogoutSuccess,
  notifyTeamIssuesLoaded,
  notifyUserLoggedIn,
  submitLogout,
} from './actions';

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

const appReducer = handleActions(
  {
    /* eslint-disable no-param-reassign */
    [submitLogout]: produce((draft) => {
      draft.loading = true;
      draft.error = false;
    }),
    [combineActions(notifyLogoutSuccess, notifyLogoutFailed)]: produce(
      (draft, { payload: { error } }) => {
        draft.loading = false;
        draft.error = error;
        draft.accessToken = null;
        draft.refreshToken = null;
        draft.currentUser = makeEmptyUser();
      },
    ),
    [notifyUserLoggedIn]: produce(
      (draft, { payload: { accessToken, refreshToken } }) => {
        draft.loading = false;
        draft.error = false;
        draft.accessToken = accessToken;
        draft.refreshToken = refreshToken;
      },
    ),
    [notifyActiveUserLoading]: produce((draft) => {
      draft.loading = true;
    }),
    [notifyActiveUserLoaded]: produce(
      (draft, { payload: { error, currentUser } }) => {
        draft.loading = false;
        draft.error = error;

        if (currentUser) {
          draft.currentUser = currentUser;
        } else {
          draft.currentUser = initialState.currentUser;
          draft.accessToken = null;
          localStorage.removeItem(LOCAL_TOKEN_NAME);
        }
      },
    ),
    [notifyCreatedTeam]: produce((draft, { payload: { newTeam } }) => {
      draft.currentUser = {
        ...draft.currentUser,
        teams: [...draft.currentUser.teams, newTeam],
      };
    }),
    [notifyTeamIssuesLoaded]: produce(
      (draft, { payload: { teamSlug, issues, timestamp } }) => {
        draft.teamIssues = {
          ...draft.teamIssues,
          [teamSlug]: {
            loaded: timestamp,
            data: issues,
          },
        };
      },
    ),
    [combineActions(
      addToast,
      addInfoToast,
      addSuccessToast,
      addErrorToast,
    )]: produce((draft, { payload: { id, title, text, color, iconType } }) => {
      draft.toasts = [
        ...draft.toasts,
        {
          id,
          title,
          text,
          color,
          iconType,
        },
      ];
    }),
    [closeToast]: produce((draft, { payload: { id } }) => {
      draft.toasts = reject(draft.toasts, (t) => t.id === id);
    }),
    /* eslint-enable */
  },
  initialState,
);

export default appReducer;
