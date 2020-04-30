import { call, put, select, takeLatest, all } from 'redux-saga/effects';

import request from 'utils/request';
import history from 'utils/history';

import {
  API_ACTIVE_USER,
  API_LOGIN,
  API_LOGOUT,
  API_TEAMS,
  LOCAL_TOKEN_NAME,
  LOCAL_REFRESH_TOKEN_NAME,
  ROUTE_TEAMS,
} from './constants';
import { makeSelectAccessToken } from './selectors';
import {
  addErrorToast,
  addInfoToast,
  addSuccessToast,
  loadActiveUser,
  loadTeamIssues,
  notifyActiveUserLoaded,
  notifyActiveUserLoading,
  notifyCreatedTeam,
  notifyLogoutFailed,
  notifyLogoutSuccess,
  notifyTeamIssuesLoaded,
  notifyUserLoggedIn,
  submitCreateTeam,
  submitCreateIssue,
  submitDeleteIssue,
  submitLogin,
  submitLogout,
} from './actions';

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Send authentication request
 */
export function* submitLoginSaga({
  payload: {
    username,
    password,
    onStart = () => {},
    onSuccess = () => {},
    onFailure = () => {},
  },
}) {
  yield call(onStart);

  const options = {
    body: JSON.stringify({ username, password }),
    method: 'POST',
    headers: JSON_HEADERS,
  };

  try {
    const response = yield call(request, API_LOGIN, options);
    const { accessToken, refreshToken, user } = response;

    localStorage.setItem(LOCAL_TOKEN_NAME, accessToken);
    localStorage.setItem(LOCAL_REFRESH_TOKEN_NAME, refreshToken);
    yield put(notifyUserLoggedIn(response));
    yield call(onSuccess, user);
  } catch (error) {
    yield call(onFailure, error);
  }
}

/**
 * Invalidate token
 */
export function* logoutUserSaga() {
  const accessToken = yield select(makeSelectAccessToken());
  const options = {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const { success } = yield call(request, API_LOGOUT, options);
    if (success) {
      yield put(notifyLogoutSuccess());
      yield put(
        addInfoToast({
          title: 'Logout',
          text: 'You have been logged-out',
        }),
      );
    } else {
      yield put(notifyLogoutFailed({ reason: 'unknown' }));
    }
  } catch (err) {
    yield put(notifyLogoutFailed());
  }

  localStorage.removeItem(LOCAL_TOKEN_NAME);
  localStorage.removeItem(LOCAL_REFRESH_TOKEN_NAME);
}

/**
 * Load active user info
 */
export function* loadActiveUserSaga() {
  yield put(notifyActiveUserLoading());

  const accessToken = yield select(makeSelectAccessToken());
  const options = {
    method: 'GET',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const activeUser = yield call(request, API_ACTIVE_USER, options);
    yield put(notifyActiveUserLoaded(activeUser));
  } catch (err) {
    yield put(notifyActiveUserLoaded(null, true));
  }
}

/**
 * Send create team request
 */
export function* submitCreateTeamSaga({
  payload: { teamName, onStart, failToast },
}) {
  yield call(onStart);
  const accessToken = yield select(makeSelectAccessToken());

  const options = {
    body: JSON.stringify({ name: teamName }),
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const team = yield call(request, API_TEAMS, options);

    if (team && team.slug) {
      yield put(notifyCreatedTeam(team));
      yield call(history.push, `${ROUTE_TEAMS}/${team.slug}`);
      yield put(
        addSuccessToast({
          title: 'Success: Team created',
          text: `Name: ${team.name}\nSlug: ${team.slug}`,
        }),
      );
    } else {
      yield put(
        addErrorToast({ ...failToast, text: team.error || 'Unknown Error' }),
      );
    }
  } catch (error) {
    yield put(addErrorToast(failToast));
  }
}

/**
 * Load issues for a team
 */
export function* loadIssuesForTeamSaga({ payload: { teamSlug } }) {
  const accessToken = yield select(makeSelectAccessToken());
  const options = {
    method: 'GET',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const url = `${API_TEAMS}/${teamSlug}/issues`;

  try {
    const { issues } = yield call(request, url, options);
    yield put(notifyTeamIssuesLoaded(teamSlug, issues));
  } catch (err) {
    yield put(
      addErrorToast({
        title: 'Error loading issues for team',
        text: err.toString(),
      }),
    );
  }
}

/**
 * Handle request to create issue for a team
 */
export function* submitCreateIssueSaga({
  payload: {
    teamSlug,
    shortDescription,
    description,
    priority,
    statusUniqueId,
    onStart,
    onSuccess,
    onFailure,
  },
}) {
  yield call(onStart);
  const accessToken = yield select(makeSelectAccessToken());

  const options = {
    body: JSON.stringify({
      shortDescription,
      description,
      priority,
      statusUniqueId,
    }),
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const url = `${API_TEAMS}/${teamSlug}/issues`;
    const issue = yield call(request, url, options);

    if (issue && issue.uniqueId) {
      yield call(onSuccess, issue);
      yield put(
        addSuccessToast({
          title: 'Success: New issue created',
          text: `ID: ${issue.uniqueId}`,
        }),
      );
      yield put(loadTeamIssues(teamSlug));
    } else {
      yield put(
        addErrorToast({
          title: 'Error creating issue',
          text: issue.error || 'Unknown Error',
        }),
      );
    }
  } catch (error) {
    yield put(
      addErrorToast({
        title: 'Error creating issue',
        text: error.toString(),
      }),
    );
    yield call(onFailure, error);
  }
}

/**
 * Delete an issue for a team
 */
export function* deleteIssueSaga({
  payload: { teamSlug, issueUniqueId, onStart, onSuccess, onFailure },
}) {
  yield call(onStart);
  const accessToken = yield select(makeSelectAccessToken());

  const options = {
    method: 'DELETE',
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const url = `${API_TEAMS}/${teamSlug}/issues/${issueUniqueId}`;
    const response = yield call(request, url, options);

    if (response && response.success) {
      yield call(onSuccess);
      yield put(
        addSuccessToast({
          title: 'Success: Deleted issue',
          text: `ID: ${issueUniqueId}`,
        }),
      );
      yield put(loadTeamIssues(teamSlug));
    } else {
      const error = response.error || 'Unknown Error';
      yield put(
        addErrorToast({
          title: 'Error deleting issue',
          text: error,
        }),
      );
      yield call(onFailure, error);
    }
  } catch (error) {
    yield put(
      addErrorToast({
        title: 'Error deleting issue',
        text: error.toString(),
      }),
    );
    yield call(onFailure, error);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* appSaga() {
  yield all([
    takeLatest(submitLogin.toString(), submitLoginSaga),
    takeLatest(loadActiveUser.toString(), loadActiveUserSaga),
    takeLatest(submitLogout.toString(), logoutUserSaga),
    takeLatest(submitCreateTeam.toString(), submitCreateTeamSaga),
    takeLatest(loadTeamIssues.toString(), loadIssuesForTeamSaga),
    takeLatest(submitCreateIssue.toString(), submitCreateIssueSaga),
    takeLatest(submitDeleteIssue.toString(), deleteIssueSaga),
  ]);
}
