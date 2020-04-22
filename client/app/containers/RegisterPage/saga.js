import { takeLatest, call, put } from 'redux-saga/effects';

import history from 'utils/history';
import request from 'utils/request';
import { API_REGISTER, ROUTE_LOGIN } from 'containers/App/constants';

import { REQUEST_REGISTER } from './constants';
import { registerSuccess } from './actions';

/**
 * Send registration request
 */
export function* submitRegistration({
  payload: { username, password, onStart, onFailure },
}) {
  yield onStart();

  const options = {
    body: JSON.stringify({ username, password }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  try {
    const response = yield call(request, API_REGISTER, options);

    if (response && response.success) {
      yield put(registerSuccess());
      yield call(history.push, ROUTE_LOGIN);
    } else {
      yield call(onFailure, (response || {}).error);
    }
  } catch (error) {
    yield call(onFailure, error);
  }
}

// Individual exports for testing
export default function* registerPageSaga() {
  yield takeLatest(REQUEST_REGISTER, submitRegistration);
}
