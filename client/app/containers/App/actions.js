/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  USER_LOGGED_IN,
  GET_ACTIVE_USER,
  ACTIVE_USER_LOADED,
  LOADING_ACTIVE_USER,
  REQUEST_LOGOUT,
  CREATED_NEW_TEAM,
  SUBMIT_CREATE_TEAM,
  REQUEST_ISSUES_FOR_TEAM,
  SHOW_TOAST,
  CLOSE_TOAST,
  LOADED_ISSUES_FOR_TEAM,
  SUBMIT_CREATE_ISSUE,
} from './constants';

export const logoutUser = () => ({ type: REQUEST_LOGOUT });

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const logoutFailed = () => ({ type: LOGOUT_FAILED });

export const getActiveUser = () => ({ type: GET_ACTIVE_USER });

export const loadingActiveUser = () => ({ type: LOADING_ACTIVE_USER });

export const userLoggedIn = (accessToken) => ({
  type: USER_LOGGED_IN,
  payload: { accessToken },
});

export const activeUserLoaded = (currentUser, error = false) => ({
  type: ACTIVE_USER_LOADED,
  payload: { currentUser, error },
});

export const submitCreateTeam = (payload) => ({
  type: SUBMIT_CREATE_TEAM,
  payload,
});

export const createdNewTeam = (newTeam) => ({
  type: CREATED_NEW_TEAM,
  payload: { newTeam },
});

export const requestIssuesForTeam = (teamSlug) => ({
  type: REQUEST_ISSUES_FOR_TEAM,
  payload: { teamSlug },
});

export const loadedIssuesForTeam = (teamSlug, issues) => ({
  type: LOADED_ISSUES_FOR_TEAM,
  payload: { teamSlug, issues },
});

export const showToast = ({ title, text, color, iconType }) => ({
  type: SHOW_TOAST,
  payload: { title, text, color, iconType },
});

export const showErrorToast = ({ title, text }) => ({
  type: SHOW_TOAST,
  payload: {
    title,
    text,
    color: 'danger',
    iconType: 'alert',
  },
});

export const showSuccessToast = ({ title, text }) => ({
  type: SHOW_TOAST,
  payload: {
    title,
    text,
    color: 'success',
    iconType: 'check',
  },
});

export const showInfoToast = ({ title, text }) => ({
  type: SHOW_TOAST,
  payload: { title, text },
});

export const closeToast = ({ id }) => ({
  type: CLOSE_TOAST,
  payload: { id },
});

export const submitCreateIssue = ({
  teamSlug,
  shortDescription,
  description,
  priority,
  statusUniqueId,
  onStart = () => {},
  onSuccess = () => {},
  onFailure = () => {},
}) => ({
  type: SUBMIT_CREATE_ISSUE,
  payload: {
    teamSlug,
    shortDescription,
    description,
    priority,
    statusUniqueId,
    onStart,
    onSuccess,
    onFailure,
  },
});
