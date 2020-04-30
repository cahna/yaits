/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { find } from 'lodash/collection';
import { get } from 'lodash/object';

import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;
const selectTeams = ({ global: { userTeams } }) => userTeams;
const selectTeamIssues = ({ global: { teamIssues } }) => teamIssues;
const selectTeamIssuesLoaded = ({ global: { teamIssuesLoaded } }) =>
  teamIssuesLoaded;

/**
 * @param {object} _ unused
 * @param {object} props
 * @returns {string} teamSlug from router props
 */
export const selectTeamSlugRouter = (_, props) => props.match.params.teamSlug;

export const makeSelectTeam = () =>
  createSelector([selectTeams, selectTeamSlugRouter], (teams, teamSlug) =>
    find(teams, (t) => t.slug === teamSlug),
  );

export const makeSelectTeamIssues = () =>
  createSelector(
    [selectTeamSlugRouter, selectTeamIssues],
    (teamSlug, teamIssues) => get(teamIssues, teamSlug, []),
  );

export const makeSelectTeamIssuesLoaded = () =>
  createSelector(
    [selectTeamSlugRouter, selectTeamIssuesLoaded],
    (teamSlug, teamIssuesLoaded) => get(teamIssuesLoaded, teamSlug, undefined),
  );

export const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, ({ currentUser }) => currentUser);

export const makeSelectUserTeams = () =>
  createSelector(selectGlobal, ({ userTeams }) => userTeams);

export const makeSelectCurrentUsername = () =>
  createSelector(selectGlobal, ({ currentUser }) => currentUser.username);

export const makeSelectLoading = () =>
  createSelector(selectGlobal, ({ loading }) => loading);

export const makeSelectError = () =>
  createSelector(selectGlobal, ({ error }) => error);

export const makeSelectAccessToken = () =>
  createSelector(selectGlobal, ({ accessToken }) => accessToken);

export const makeSelectRefreshToken = () =>
  createSelector(selectGlobal, ({ refreshToken }) => refreshToken);

export const makeSelectToasts = () =>
  createSelector(selectGlobal, ({ toasts }) => toasts);
