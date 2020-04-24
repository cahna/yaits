import { TEAM_NAME_CHANGED, CREATE_TEAM_FORM_LOADING } from './constants';

export const changeTeamName = (teamName) => ({
  type: TEAM_NAME_CHANGED,
  payload: { teamName },
});

export const createTeamFormLoading = (loading = true) => ({
  type: CREATE_TEAM_FORM_LOADING,
  payload: { loading },
});
