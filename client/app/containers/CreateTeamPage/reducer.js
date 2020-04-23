import { replace } from 'lodash/string';
import produce from 'immer';
import {
  TEAM_NAME_CHANGED,
  CREATE_TEAM_FAILURE,
  CREATE_TEAM_FORM_LOADING,
  MIN_TEAM_NAME_LEN,
  MAX_TEAM_NAME_LEN,
  CREATE_TEAM_SUCCESS,
} from './constants';

export const initialState = {
  teamName: '',
  teamNameError: false,
  loading: false,
  createTeamError: false,
};

const sanitizeTeamName = (username = '') =>
  replace(username, /\s|[^a-z0-9.\-_]/i, '');

const showTeamNameError = ({ teamName }) =>
  teamName.length < MIN_TEAM_NAME_LEN || teamName.length > MAX_TEAM_NAME_LEN;

/* eslint-disable default-case, no-param-reassign */
const CreateTeamPageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case TEAM_NAME_CHANGED:
        draft.teamName = sanitizeTeamName(payload.teamName);
        draft.teamNameError = showTeamNameError(draft);
        break;
      case CREATE_TEAM_FORM_LOADING:
        draft.loading = payload.loading;
        draft.createTeamError = false;
        break;
      case CREATE_TEAM_SUCCESS:
        draft.createTeamError = false;
        draft.loading = false;
        break;
      case CREATE_TEAM_FAILURE:
        draft.createTeamError = true;
        draft.loading = false;
        break;
    }
  });

export default CreateTeamPageReducer;
