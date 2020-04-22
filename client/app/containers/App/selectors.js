/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;

const selectRouter = (state) => state.router;

const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, (globalState) => globalState.currentUser);

const makeSelectLoading = () =>
  createSelector(selectGlobal, (globalState) => globalState.loading);

const makeSelectError = () =>
  createSelector(selectGlobal, (globalState) => globalState.error);

const makeSelectAccessToken = () =>
  createSelector(selectGlobal, (globalState) => globalState.accessToken);

const makeSelectLocation = () =>
  createSelector(selectRouter, (routerState) => routerState.location);

const makeSelectActiveTeam = () =>
  createSelector(selectGlobal, (globalState) => globalState.activeTeam);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectAccessToken,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
  makeSelectActiveTeam,
};
