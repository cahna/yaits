import { takeLatest, call, put } from 'redux-saga/effects';

import history from 'utils/history';
import request from 'utils/request';
import {
  API_LOGIN,
  LOCAL_TOKEN_NAME,
  ROUTE_HOME,
} from 'containers/App/constants';
import { userLoggedIn } from 'containers/App/actions';

import { REQUEST_LOGIN } from './constants';

/**
 * Send authentication request
 */
export function* submitLogin({
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
    const response = yield call(request, API_LOGIN, options);

    localStorage.setItem(LOCAL_TOKEN_NAME, response.accessToken);
    yield put(userLoggedIn(response.accessToken));
    yield call(history.push, ROUTE_HOME);
  } catch (error) {
    yield put(onFailure(error));
    localStorage.removeItem(LOCAL_TOKEN_NAME);
  }
}

export default function* loginPageSaga() {
  yield takeLatest(REQUEST_LOGIN, submitLogin);
}
