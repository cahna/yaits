import { takeLatest } from 'redux-saga/effects';

// import request from 'utils/request';
// import { makeSelectAccessToken } from 'containers/App/selectors';

import { REQUEST_ISSUES } from './constants';

/**
 * Load team info
 */
export function* loadIssuesForTeam() {
  // yield put(loadingActiveUser());
  // const accessToken = yield select(makeSelectAccessToken());
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // };
  // try {
  //   const activeUser = yield call(request, API_ACTIVE_USER, options);
  //   yield put(activeUserLoaded(activeUser));
  // } catch (err) {
  //   yield put(activeUserLoaded(null, true));
  // }
}

export default function* appSaga() {
  yield takeLatest(REQUEST_ISSUES, loadIssuesForTeam);
}
