import { call, put, select, takeLatest, all } from 'redux-saga/effects';

import request from 'utils/request';
import history from 'utils/history';

import {
  REQUEST_LOGOUT,
  API_LOGOUT,
  API_TEAMS,
  ROUTE_TEAMS,
  LOCAL_TOKEN_NAME,
  API_ACTIVE_USER,
  GET_ACTIVE_USER,
  SUBMIT_CREATE_TEAM,
  REQUEST_ISSUES_FOR_TEAM,
  SUBMIT_CREATE_ISSUE,
  DELETE_ISSUE,
} from './constants';
import { makeSelectAccessToken } from './selectors';
import {
  logoutSuccess,
  logoutFailed,
  activeUserLoaded,
  loadingActiveUser,
  createdNewTeam,
  showErrorToast,
  requestIssuesForTeam,
  loadedIssuesForTeam,
  showSuccessToast,
  showInfoToast,
} from './actions';

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

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
    takeLatest(GET_ACTIVE_USER, loadActiveUser),
    takeLatest(REQUEST_LOGOUT, logoutUser),
    takeLatest(SUBMIT_CREATE_TEAM, submitCreateTeam),
    takeLatest(REQUEST_ISSUES_FOR_TEAM, loadIssuesForTeam),
    takeLatest(SUBMIT_CREATE_ISSUE, submitCreateIssue),
    takeLatest(DELETE_ISSUE, deleteIssue),
  ]);
}
