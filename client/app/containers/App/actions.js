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

export const createdNewTeam = (newTeam) => ({
  type: CREATED_NEW_TEAM,
  payload: { newTeam },
});
