import { takeLatest, call, put, select } from 'redux-saga/effects';

import history from 'utils/history';
import request from 'utils/request';
import { API_TEAMS, ROUTE_TEAMS } from 'containers/App/constants';
import { createdNewTeam } from 'containers/App/actions';
import { makeSelectAccessToken } from 'containers/App/selectors';

import { SUBMIT_CREATE_TEAM } from './constants';

/**
 * Send create team request
 */
export function* submitCreateTeam({
  payload: { teamName, onStart, onFailure },
}) {
  yield call(onStart);
  const accessToken = yield select(makeSelectAccessToken());

  const options = {
    body: JSON.stringify({ name: teamName }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const team = yield call(request, API_TEAMS, options);

    if (team && team.slug) {
      yield put(createdNewTeam(team));
      yield call(history.push, `${ROUTE_TEAMS}/${team.slug}`);
    } else {
      yield call(onFailure, (team || {}).error);
    }
  } catch (error) {
    yield call(onFailure, error);
  }
}

// Individual exports for testing
export default function* createTeamPageSaga() {
  yield takeLatest(SUBMIT_CREATE_TEAM, submitCreateTeam);
}
