import { takeLatest } from 'redux-saga/effects';
import { testSaga } from 'redux-saga-test-plan';

import history from 'utils/history';
import request from 'utils/request';
import { API_LOGIN, ROUTE_HOME } from 'containers/App/constants';
import { userLoggedIn } from 'containers/App/actions';

import { REQUEST_LOGIN } from '../constants';
import { loginFailure, loginFormLoading } from '../actions';
import loginPageSaga, { submitLogin } from '../saga';

const username = 'TestUser';
const password = 'TestPassword';
const accessToken = '_JWT_';
const options = {
  body: JSON.stringify({ username, password }),
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

/* eslint-disable redux-saga/yield-effects */
describe('loginPageSaga', () => {
  const mainSaga = loginPageSaga();

  it('should start task to watch for REQUEST_LOGIN action', () => {
    const takeLatestDescriptor = mainSaga.next().value;

    expect(takeLatestDescriptor).toEqual(
      takeLatest(REQUEST_LOGIN, submitLogin),
    );
  });
});

describe('submitLogin saga generator', () => {
  const onStart = loginFormLoading;
  const onFailure = loginFailure;

  it('handles successful login', () => {
    testSaga(() =>
      submitLogin({
        payload: {
          username,
          password,
          onStart,
          onFailure,
        },
      }),
    )
      .next()
      .next()
      .call(request, API_LOGIN, options)
      .next({ accessToken })
      .put(userLoggedIn(accessToken))
      .next()
      .call(history.push, ROUTE_HOME)
      .next()
      .isDone();
  });

  it('handles failed login', () => {
    testSaga(() =>
      submitLogin({
        payload: {
          username,
          password,
          onStart,
          onFailure,
        },
      }),
    )
      .next()
      .next()
      .call(request, API_LOGIN, options)
      .throw('dummy')
      .put(loginFailure('dummy'))
      .next()
      .isDone();
  });
});
