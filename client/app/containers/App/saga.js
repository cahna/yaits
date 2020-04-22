import { call, put, select, takeLatest } from 'redux-saga/effects';

import request from 'utils/request';

import {
  REQUEST_LOGOUT,
  API_LOGOUT,
  LOCAL_TOKEN_NAME,
  API_ACTIVE_USER,
  GET_ACTIVE_USER,
} from './constants';
import { makeSelectAccessToken } from './selectors';
import {
  logoutSuccess,
  logoutFailed,
  activeUserLoaded,
  loadingActiveUser,
} from './actions';

/**
 * Invalidate token
 */
export function* logoutUser() {
  const accessToken = yield select(makeSelectAccessToken());
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const { success } = yield call(request, API_LOGOUT, options);
    if (success) {
      yield put(logoutSuccess());
    } else {
      yield put(logoutFailed({ reason: 'unknown' }));
    }
  } catch (err) {
    yield put(logoutFailed());
  }

  localStorage.removeItem(LOCAL_TOKEN_NAME);
}

/**
 * Load active user info
 */
export function* loadActiveUser() {
  yield put(loadingActiveUser());

  const accessToken = yield select(makeSelectAccessToken());
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const activeUser = yield call(request, API_ACTIVE_USER, options);
    yield put(activeUserLoaded(activeUser));
  } catch (err) {
    yield put(activeUserLoaded(null, true));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* appSaga() {
  yield takeLatest(GET_ACTIVE_USER, loadActiveUser);
  yield takeLatest(REQUEST_LOGOUT, logoutUser);
}
