/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, (globalState) => globalState.currentUser);

const makeSelectCurrentUserTeams = () =>
  createSelector(selectGlobal, ({ currentUser }) => currentUser.teams);

const makeSelectCurrentUsername = () =>
  createSelector(selectGlobal, ({ currentUser }) => currentUser.username);

const makeSelectLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.loading);

const makeSelectError = () =>
  createSelector(selectGlobal, (globalState) => globalState.error);

const makeSelectAccessToken = () =>
  createSelector(selectGlobal, (globalState) => globalState.accessToken);

const makeSelectToasts = () =>
  createSelector(selectGlobal, (globalState) => globalState.toasts);

const makeSelectTeamIssues = () =>
  createSelector(selectGlobal, (globalState) => globalState.teamIssues);

export {
  makeSelectAccessToken,
  makeSelectCurrentUser,
  makeSelectCurrentUsername,
  makeSelectCurrentUserTeams,
  makeSelectError,
  makeSelectLoading,
  makeSelectTeamIssues,
  makeSelectToasts,
  selectGlobal,
};
