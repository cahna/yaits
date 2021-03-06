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
export const selectRouterTeamSlug = (_, props) => props.match.params.teamSlug;

export const selectRouterIssueId = (_, props) => props.match.params.issueId;

export const makeSelectTeam = () =>
  createSelector([selectTeams, selectRouterTeamSlug], (teams, teamSlug) =>
    get(teams, teamSlug),
  );

export const makeSelectTeamIssues = () =>
  createSelector(
    [selectRouterTeamSlug, selectTeamIssues],
    (teamSlug, teamIssues) => get(teamIssues, teamSlug, []),
  );

export const makeSelectCurrentIssue = () => {
  const getIssuesForTeam = makeSelectTeamIssues();
  return createSelector(
    [getIssuesForTeam, selectRouterIssueId],
    (teamIssues, issueId) => find(teamIssues, (i) => i.uniqueId === issueId),
  );
};

export const makeSelectTeamIssuesLoaded = () =>
  createSelector(
    [selectRouterTeamSlug, selectTeamIssuesLoaded],
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
