import { takeLatest } from 'redux-saga/effects';
// import { testSaga } from 'redux-saga-test-plan';

// import request from 'utils/request';
// import { API_REGISTER } from 'containers/App/constants';

import { SUBMIT_CREATE_TEAM } from '../constants';
import createTeamPageSaga, { submitCreateTeam } from '../saga';

// const teamName = 'Test Team';
// const accessToken = '_JWT_';
// const options = {
//   body: JSON.stringify({ name: teamName }),
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${accessToken}`,
//   },
// };

/* eslint-disable redux-saga/yield-effects */
describe('CreateTeamPageSaga', () => {
  const mainSaga = createTeamPageSaga();

  it('should start task to watch for REQUEST_REGISTER action', () => {
    const takeLatestDescriptor = mainSaga.next().value;

    expect(takeLatestDescriptor).toEqual(
      takeLatest(SUBMIT_CREATE_TEAM, submitCreateTeam),
    );
  });
});

// describe('submitRegistration saga generator', () => {
//   it('handles successful register', () => {
//     const onStart = registerFormLoading;
//     const onFailure = registerFailure;

//     testSaga(() =>
//       submitRegistration({
//         payload: {
//           username,
//           password,
//           onStart,
//           onFailure,
//         },
//       }),
//     )
//       .next()
//       .next()
//       .call(request, API_REGISTER, options)
//       .next({ success: true })
//       .put(registerSuccess())
//       .next()
//       .next()
//       .isDone();
//   });

//   it('handles failed register', () => {
//     const onStart = registerFormLoading;
//     const onFailure = registerFailure;

//     testSaga(() =>
//       submitRegistration({
//         payload: {
//           username,
//           password,
//           onStart,
//           onFailure,
//         },
//       }),
//     )
//       .next()
//       .next()
//       .call(request, API_REGISTER, options)
//       .throw('dummy')
//       .call(registerFailure, 'dummy')
//       .next()
//       .isDone();
//   });
// });
