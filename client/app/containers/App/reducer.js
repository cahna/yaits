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
});

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: makeEmptyUser(),
  userTeams: {},
  teamIssues: {},
  teamIssuesLoaded: {},
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
        draft.userTeams = {};
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
      (
        draft,
        {
          payload: {
            error,
            currentUser: { teams, ...userData },
          },
        },
      ) => {
        draft.loading = false;
        draft.error = error;
        if (!error) {
          draft.currentUser = userData;
          draft.userTeams = Object.fromEntries(teams.map((t) => [t.slug, t]));
        }
      },
    ),
    [notifyCreatedTeam]: produce((draft, { payload: { newTeam } }) => {
      draft.userTeams = {
        ...draft.userTeams,
        [newTeam.slug]: newTeam,
      };
    }),
    [notifyTeamIssuesLoaded]: produce(
      (draft, { payload: { teamSlug, issues, timestamp } }) => {
        draft.teamIssues = {
          ...draft.teamIssues,
          [teamSlug]: issues,
        };
        draft.teamIssuesLoaded = {
          ...draft.teamIssuesLoaded,
          [teamSlug]: timestamp,
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
