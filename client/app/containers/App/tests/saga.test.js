import { takeLatest } from 'redux-saga/effects';
import { testSaga } from 'redux-saga-test-plan';

import request from 'utils/request';

import { GET_ACTIVE_USER, API_ACTIVE_USER, REQUEST_LOGOUT } from '../constants';
import { loadingActiveUser, activeUserLoaded } from '../actions';
import appSaga, { logoutUser, loadActiveUser } from '../saga';

const accessToken = '_JWT_';

/* eslint-disable redux-saga/yield-effects */
describe('appSaga', () => {
  const mainSaga = appSaga();

  it('should start thread to watch for expected actions', () => {
    expect(mainSaga.next().value).toEqual(
      takeLatest(GET_ACTIVE_USER, loadActiveUser),
    );
    expect(mainSaga.next().value).toEqual(
      takeLatest(REQUEST_LOGOUT, logoutUser),
    );
  });
});

describe('loadActiveUser saga generator', () => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const userResponse = {
    username: 'TestUser',
    uniqueId: 'abc-123-def-456',
  };

  it('handles succussful fetch of active user', () => {
    testSaga(loadActiveUser)
      .next()
      .put(loadingActiveUser())
      .next()
      .next(accessToken)
      .call(request, API_ACTIVE_USER, options)
      .next(userResponse)
      .put(activeUserLoaded(userResponse))
      .next()
      .isDone();
  });

  it('handles failed fetch of active user', () => {
    testSaga(loadActiveUser)
      .next()
      .put(loadingActiveUser())
      .next()
      .next(accessToken)
      .call(request, API_ACTIVE_USER, options)
      .throw('dummy')
      .put(activeUserLoaded(null, true))
      .next()
      .isDone();
  });
});
