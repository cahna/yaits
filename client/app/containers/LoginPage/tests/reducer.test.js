import produce from 'immer';
import loginPageReducer from '../reducer';
import {
  changeUsername,
  changePassword,
  loginSuccess,
  loginFailure,
  loginFormLoading,
} from '../actions';

/* eslint-disable default-case, no-param-reassign */
describe('loginPageReducer', () => {
  let state;

  beforeEach(() => {
    state = {
      password: '',
      username: '',
      loading: false,
      loginError: false,
      usernameError: false,
      passwordError: false,
    };
  });

  it('returns the initial state', () => {
    const expectedResult = state;
    expect(loginPageReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle changeUsername correctly', () => {
    expect(loginPageReducer(state, changeUsername('T'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'T';
      }),
    );
    expect(loginPageReducer(state, changeUsername('Te'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'Te';
      }),
    );
    expect(loginPageReducer(state, changeUsername('Tes'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'Tes';
      }),
    );
    expect(loginPageReducer(state, changeUsername('Test'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'Test';
      }),
    );
    expect(loginPageReducer(state, changeUsername())).toEqual(
      produce(state, (draft) => {
        draft.username = '';
      }),
    );
  });

  it('should handle changePassword correctly', () => {
    expect(loginPageReducer(state, changePassword('T'))).toEqual(
      produce(state, (draft) => {
        draft.password = 'T';
      }),
    );
    expect(loginPageReducer(state, changePassword('Te'))).toEqual(
      produce(state, (draft) => {
        draft.password = 'Te';
      }),
    );
    expect(loginPageReducer(state, changePassword('Tes'))).toEqual(
      produce(state, (draft) => {
        draft.password = 'Tes';
      }),
    );
    expect(loginPageReducer(state, changePassword('Test'))).toEqual(
      produce(state, (draft) => {
        draft.password = 'Test';
      }),
    );
    expect(loginPageReducer(state, changePassword())).toEqual(
      produce(state, (draft) => {
        draft.password = '';
      }),
    );
  });

  it('should handle loginSuccess correctly', () => {
    expect(loginPageReducer(state, loginSuccess())).toEqual(
      produce(state, (draft) => {
        draft.loginError = false;
        draft.loading = false;
      }),
    );
  });

  it('should handle loginFailure correctly', () => {
    expect(loginPageReducer(state, loginFailure())).toEqual(
      produce(state, (draft) => {
        draft.loginError = true;
      }),
    );
  });

  it('should handle loginFormLoading correctly', () => {
    expect(loginPageReducer(state, loginFormLoading())).toEqual(
      produce(state, (draft) => {
        draft.loading = true;
      }),
    );
    expect(loginPageReducer(state, loginFormLoading(false))).toEqual(
      produce(state, (draft) => {
        draft.loading = false;
      }),
    );
  });
});
