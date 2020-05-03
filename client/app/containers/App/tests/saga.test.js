import { all, takeLatest } from 'redux-saga/effects';
import { testSaga } from 'redux-saga-test-plan';

import request from 'utils/request';

import { API_ACTIVE_USER, API_LOGIN } from '../constants';
import {
  addErrorToast,
  loadActiveUser,
  loadTeamIssues,
  notifyActiveUserLoaded,
  notifyActiveUserLoading,
  notifyLogoutSuccess,
  notifyUserLoggedIn,
  submitCreateTeam,
  submitCreateIssue,
  submitDeleteIssue,
  submitLogin,
  submitLogout,
} from '../actions';
import appSaga, {
  deleteIssueSaga,
  loadActiveUserSaga,
  loadIssuesForTeamSaga,
  logoutUserSaga,
  submitCreateIssueSaga,
  submitCreateTeamSaga,
  submitLoginSaga,
} from '../saga';

/* eslint-disable redux-saga/yield-effects */
describe('sagas', () => {
  describe('appSaga', () => {
    const mainSaga = appSaga();

    it('should start thread to watch for expected actions', () => {
      expect(mainSaga.next().value).toEqual(
        all([
          takeLatest(submitLogin, submitLoginSaga),
          takeLatest(loadActiveUser, loadActiveUserSaga),
          takeLatest(submitLogout, logoutUserSaga),
          takeLatest(submitCreateTeam, submitCreateTeamSaga),
          takeLatest(loadTeamIssues, loadIssuesForTeamSaga),
          takeLatest(submitCreateIssue, submitCreateIssueSaga),
          takeLatest(submitDeleteIssue, deleteIssueSaga),
        ]),
      );
    });
  });

  describe('submitLogin saga', () => {
    const onStart = jest.fn();
    const onFailure = jest.fn();
    const onSuccess = jest.fn();
    const username = 'TestUser';
    const password = 'TestPassword';
    const accessToken = '_JWT_';
    const refreshToken = '_RJWT_';
    const options = {
      body: JSON.stringify({ username, password }),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    it('handles successful login', () => {
      const mockResponse = {
        accessToken,
        refreshToken,
        user: { username, uniqueId: 'mockuuid' },
      };
      testSaga(() =>
        submitLoginSaga({
          payload: {
            username,
            password,
            onStart,
            onSuccess,
            onFailure,
          },
        }),
      )
        .next()
        .call(onStart)
        .next()
        .call(request, API_LOGIN, options)
        .next(mockResponse)
        .put(notifyUserLoggedIn(mockResponse))
        .next()
        .call(onSuccess, mockResponse.user)
        .next()
        .isDone();
    });

    it('handles failed login', () => {
      testSaga(() =>
        submitLoginSaga({
          payload: {
            username,
            password,
            onStart,
            onFailure,
          },
        }),
      )
        .next()
        .call(onStart)
        .next()
        .call(request, API_LOGIN, options)
        .throw('dummy')
        .call(onFailure, 'dummy')
        .next()
        .isDone();
    });
  });

  describe('loadActiveUser saga', () => {
    const accessToken = '_JWT_';
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
      testSaga(loadActiveUserSaga)
        .next()
        .put(notifyActiveUserLoading())
        .next()
        .next(accessToken)
        .call(request, API_ACTIVE_USER, options)
        .next(userResponse)
        .put(notifyActiveUserLoaded(userResponse))
        .next()
        .isDone();
    });

    it('handles failed fetch of active user', () => {
      testSaga(loadActiveUserSaga)
        .next()
        .put(notifyActiveUserLoading())
        .next()
        .next(accessToken)
        .call(request, API_ACTIVE_USER, options)
        .throw('dummy')
        .put(notifyLogoutSuccess())
        .next()
        .put(
          addErrorToast({
            title: 'You have been logged-out',
            text: 'dummy',
          }),
        )
        .next()
        .isDone();
    });
  });
});
