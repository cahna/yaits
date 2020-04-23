import {
  TEAM_NAME_CHANGED,
  CREATE_TEAM_FAILURE,
  CREATE_TEAM_SUCCESS,
  CREATE_TEAM_FORM_LOADING,
  SUBMIT_CREATE_TEAM,
} from './constants';

export const changeTeamName = (teamName) => ({
  type: TEAM_NAME_CHANGED,
  payload: { teamName },
});

export const submitCreateTeam = ({ teamName }) => ({
  type: SUBMIT_CREATE_TEAM,
  payload: { teamName },
});

export const createTeamFormLoading = (loading = true) => ({
  type: CREATE_TEAM_FORM_LOADING,
  payload: { loading },
});

export const createTeamSuccess = () => ({
  type: CREATE_TEAM_SUCCESS,
});

export const createTeamFailure = (error = '') => ({
  type: CREATE_TEAM_FAILURE,
  payload: { error },
});
