/**
 * App Actions
 */
import { createActions } from 'redux-actions';
import { kebabCase } from 'lodash/string';

const makeToastId = (title, type = 'default') =>
  kebabCase(`${type}-${title}-${Date.now()}`);

export const {
  yaits: {
    app: {
      addErrorToast,
      addInfoToast,
      addSuccessToast,
      addToast,
      closeToast,
      loadActiveUser,
      loadTeamIssues,
      notifyActiveUserLoaded,
      notifyActiveUserLoading,
      notifyCreatedTeam,
      notifyLogoutFailed,
      notifyLogoutSuccess,
      notifyTeamIssuesLoaded,
      notifyUserLoggedIn,
      submitCreateIssue,
      submitCreateTeam,
      submitDeleteIssue,
      submitLogin,
      submitLogout,
    },
  },
} = createActions({
  YAITS: {
    APP: {
      ADD_ERROR_TOAST: ({ title, text }) => ({
        id: makeToastId(title, 'error'),
        title,
        text,
        color: 'danger',
        iconType: 'alert',
      }),
      ADD_INFO_TOAST: ({ title, text }) => ({
        id: makeToastId(title, 'info'),
        title,
        text,
      }),
      ADD_SUCCESS_TOAST: ({ title, text }) => ({
        id: makeToastId(title, 'success'),
        title,
        text,
        color: 'success',
        iconType: 'check',
      }),
      ADD_TOAST: ({ title, ...rest }) => ({
        id: makeToastId(title),
        ...rest,
      }),
      CLOSE_TOAST: undefined,
      LOAD_ACTIVE_USER: undefined,
      LOAD_TEAM_ISSUES: (teamSlug) => ({ teamSlug }),
      NOTIFY_ACTIVE_USER_LOADED: (currentUser, error = false) => ({
        currentUser,
        error,
      }),
      NOTIFY_ACTIVE_USER_LOADING: undefined,
      NOTIFY_CREATED_TEAM: (newTeam) => ({ newTeam }),
      NOTIFY_LOGOUT_FAILED: () => ({ error: true }),
      NOTIFY_LOGOUT_SUCCESS: () => ({ error: false }),
      NOTIFY_TEAM_ISSUES_LOADED: (teamSlug, issues) => ({
        teamSlug,
        issues,
        timestamp: Date.now(),
      }),
      NOTIFY_USER_LOGGED_IN: undefined,
      SUBMIT_CREATE_ISSUE: undefined,
      SUBMIT_CREATE_TEAM: undefined,
      SUBMIT_DELETE_ISSUE: undefined,
      SUBMIT_LOGIN: undefined,
      SUBMIT_LOGOUT: undefined,
    },
  },
});
