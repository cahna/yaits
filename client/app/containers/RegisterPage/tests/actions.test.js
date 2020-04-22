import {
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  USERNAME_CHANGED,
  REQUEST_REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from '../constants';
import {
  changeUsername,
  changePassword,
  changeConfirmPassword,
  submitRegister,
  registerSuccess,
  registerFailure,
} from '../actions';

describe('RegisterPage actions', () => {
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

  describe('changeConfirmPassword Action', () => {
    it('has a type of CONFIRM_PASSWORD_CHANGED', () => {
      const expected = {
        type: CONFIRM_PASSWORD_CHANGED,
        payload: { confirmPassword: 't' },
      };
      expect(changeConfirmPassword('t')).toEqual(expected);
    });
  });

  describe('submitRegister Action', () => {
    it('has a type of REQUEST_REGISTER', () => {
      const payload = {
        username: 'testuser',
        password: 'hunter12',
        onStart: jest.fn(),
        onFailure: jest.fn(),
      };
      const expected = {
        type: REQUEST_REGISTER,
        payload,
      };
      expect(submitRegister(payload)).toEqual(expected);
    });
  });

  describe('registerSuccess Action', () => {
    it('has a type of REGISTER_SUCCESS', () => {
      const expected = {
        type: REGISTER_SUCCESS,
      };
      expect(registerSuccess()).toEqual(expected);
    });
  });

  describe('registerFailure Action', () => {
    it('sets default payload with no args', () => {
      const expected = {
        type: REGISTER_FAILURE,
        payload: { error: '' },
      };
      expect(registerFailure()).toEqual(expected);
    });

    it('sets error payload with arg', () => {
      const expected = {
        type: REGISTER_FAILURE,
        payload: { error: 'TEST' },
      };
      expect(registerFailure('TEST')).toEqual(expected);
    });
  });
});
