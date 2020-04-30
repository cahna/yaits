import { replace } from 'lodash/string';
import { handleActions } from 'redux-actions';
import produce from 'immer';
import { MIN_TEAM_NAME_LEN, MAX_TEAM_NAME_LEN } from './constants';
import { setTeamName, setFormLoading } from './actions';

export const initialState = {
  teamName: '',
  teamNameError: false,
  loading: false,
  createTeamError: false,
};

const sanitizeTeamName = (username = '') =>
  replace(replace(username, /[^a-z0-9.\-_ ]/i, ''), /  +/, ' ');

const showTeamNameError = ({ teamName }) =>
  teamName.length < MIN_TEAM_NAME_LEN || teamName.length > MAX_TEAM_NAME_LEN;

const reducerFactory = handleActions(
  {
    /* eslint-disable no-param-reassign */
    [setTeamName]: (draft, { payload: { teamName } }) => {
      draft.teamName = sanitizeTeamName(teamName);
      draft.teamNameError = showTeamNameError(draft);
    },
    [setFormLoading]: (draft, { payload: { loading } }) => {
      draft.loading = loading;
      draft.createTeamError = false;
    },
    /* eslint-enable */
  },
  initialState,
);

export default produce((draft, action) => reducerFactory(draft, action));
