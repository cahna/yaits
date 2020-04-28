import { call, put, select, takeLatest, all } from 'redux-saga/effects';

import request from 'utils/request';
import history from 'utils/history';

import {
  API_ACTIVE_USER,
  API_LOGIN,
  API_LOGOUT,
  API_TEAMS,
  DELETE_ISSUE,
  GET_ACTIVE_USER,
  LOCAL_TOKEN_NAME,
  LOCAL_REFRESH_TOKEN_NAME,
  REQUEST_ISSUES_FOR_TEAM,
  REQUEST_LOGIN,
  REQUEST_LOGOUT,
  ROUTE_TEAMS,
  SUBMIT_CREATE_ISSUE,
  SUBMIT_CREATE_TEAM,
} from './constants';
import { makeSelectAccessToken } from './selectors';
import {
  activeUserLoaded,
  createdNewTeam,
  loadedIssuesForTeam,
  loadingActiveUser,
  logoutFailed,
  logoutSuccess,
  requestIssuesForTeam,
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  userLoggedIn,
} from './actions';

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Send authentication request
 */
export function* submitLogin({
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
    yield put(userLoggedIn(response));
    yield call(onSuccess, user);
  } catch (error) {
    yield call(onFailure, error);
  }
}

/**
 * Invalidate token
 */
export function* logoutUser() {
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
      yield put(logoutSuccess());
      yield put(
        showInfoToast({
          title: 'Logout',
          text: 'You have been logged-out',
        }),
      );
    } else {
      yield put(logoutFailed({ reason: 'unknown' }));
    }
  } catch (err) {
    yield put(logoutFailed());
  }

  localStorage.removeItem(LOCAL_TOKEN_NAME);
  localStorage.removeItem(LOCAL_REFRESH_TOKEN_NAME);
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
      ...JSON_HEADERS,
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
 * Send create team request
 */
export function* submitCreateTeam({
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
      yield put(createdNewTeam(team));
      yield call(history.push, `${ROUTE_TEAMS}/${team.slug}`);
      yield put(
        showSuccessToast({
          title: 'Success: Team created',
          text: `Name: ${team.name}\nSlug: ${team.slug}`,
        }),
      );
    } else {
      yield put(
        showErrorToast({ ...failToast, text: team.error || 'Unknown Error' }),
      );
    }
  } catch (error) {
    yield put(showErrorToast(failToast));
  }
}

/**
 * Load issues for a team
 */
export function* loadIssuesForTeam({ payload: { teamSlug } }) {
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
    yield put(loadedIssuesForTeam(teamSlug, issues));
  } catch (err) {
    yield put(
      showErrorToast({
        title: 'Error loading issues for team',
        text: err.toString(),
      }),
    );
  }
}

/**
 * Handle request to create issue for a team
 */
export function* submitCreateIssue({
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
        showSuccessToast({
          title: 'Success: New issue created',
          text: `ID: ${issue.uniqueId}`,
        }),
      );
      yield put(requestIssuesForTeam(teamSlug));
    } else {
      yield put(
        showErrorToast({
          title: 'Error creating issue',
          text: issue.error || 'Unknown Error',
        }),
      );
    }
  } catch (error) {
    yield put(
      showErrorToast({
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
export function* deleteIssue({
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
        showSuccessToast({
          title: 'Success: Deleted issue',
          text: `ID: ${issueUniqueId}`,
        }),
      );
      yield put(requestIssuesForTeam(teamSlug));
    } else {
      const error = response.error || 'Unknown Error';
      yield put(
        showErrorToast({
          title: 'Error deleting issue',
          text: error,
        }),
      );
      yield call(onFailure, error);
    }
  } catch (error) {
    yield put(
      showErrorToast({
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
    takeLatest(REQUEST_LOGIN, submitLogin),
    takeLatest(GET_ACTIVE_USER, loadActiveUser),
    takeLatest(REQUEST_LOGOUT, logoutUser),
    takeLatest(SUBMIT_CREATE_TEAM, submitCreateTeam),
    takeLatest(REQUEST_ISSUES_FOR_TEAM, loadIssuesForTeam),
    takeLatest(SUBMIT_CREATE_ISSUE, submitCreateIssue),
    takeLatest(DELETE_ISSUE, deleteIssue),
  ]);
}
