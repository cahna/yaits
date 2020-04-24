/**
 * TeamPage state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTeamPage = (state) => state.team || initialState;

const makeSelectIssues = () =>
  createSelector(selectTeamPage, (teamState) => teamState.issues);

const makeSelectLoading = () =>
  createSelector(selectTeamPage, (teamState) => teamState.loading);

const makeSelectError = () =>
  createSelector(selectTeamPage, (teamState) => teamState.error);

export { selectTeamPage, makeSelectLoading, makeSelectError, makeSelectIssues };
