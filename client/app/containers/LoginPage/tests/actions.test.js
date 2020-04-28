import {
  LOGIN_FAILURE,
  LOGIN_FORM_LOADING,
  LOGIN_SUCCESS,
  PASSWORD_CHANGED,
  USERNAME_CHANGED,
} from '../constants';
import {
  changePassword,
  changeUsername,
  loginFailure,
  loginFormLoading,
  loginSuccess,
} from '../actions';

describe('LoginPage actions', () => {
  describe('changeUsername Action', () => {
    it('has a type of USERNAME_CHANGED', () => {
      const expected = {
        type: USERNAME_CHANGED,
        payload: { username: 'testing' },
      };
      expect(changeUsername('testing')).toEqual(expected);
    });
  });

  describe('changePassword Action', () => {
    it('has a type of PASSWORD_CHANGED', () => {
      const expected = {
        type: PASSWORD_CHANGED,
        payload: { password: 't' },
      };
      expect(changePassword('t')).toEqual(expected);
    });
  });

  describe('loginSuccess Action', () => {
    it('has a type of LOGIN_SUCCESS', () => {
      const expected = {
        type: LOGIN_SUCCESS,
        payload: { accessToken: '_JWT_' },
      };
      expect(loginSuccess('_JWT_')).toEqual(expected);
    });
  });

  describe('loginFailure Action', () => {
    it('has a type of LOGIN_FAILURE', () => {
      const expected = {
        type: LOGIN_FAILURE,
        payload: { error: undefined },
      };
      expect(loginFailure()).toEqual(expected);
    });

    it('accepts an optional payload', () => {
      const expected = {
        type: LOGIN_FAILURE,
        payload: { error: 'TEST' },
      };
      expect(loginFailure('TEST')).toEqual(expected);
    });
  });

  describe('loginFormLoading Action', () => {
    it('has a type of LOGIN_FORM_LOADING', () => {
      const expected = {
        type: LOGIN_FORM_LOADING,
        payload: { loading: true },
      };
      expect(loginFormLoading()).toEqual(expected);
    });

    it('accepts an optional argument', () => {
      const expected = {
        type: LOGIN_FORM_LOADING,
        payload: { loading: false },
      };
      expect(loginFormLoading(false)).toEqual(expected);
    });
  });
});
