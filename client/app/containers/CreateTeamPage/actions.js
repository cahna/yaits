import { createActions } from 'redux-actions';

export const {
  yaits: {
    createTeamPage: { setTeamName, setFormLoading },
  },
} = createActions({
  YAITS: {
    CREATE_TEAM_PAGE: {
      SET_TEAM_NAME: (teamName) => ({ teamName }),
      SET_FORM_LOADING: (loading = true) => ({ loading }),
    },
  },
});
