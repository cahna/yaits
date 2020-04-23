import produce from 'immer';
import registerPageReducer, { initialState } from '../reducer';
import {
  changeUsername,
  changePassword,
  changeConfirmPassword,
  registerFormLoading,
  registerFailure,
} from '../actions';

/* eslint-disable default-case, no-param-reassign */
describe('registerPageReducer', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  it('returns the initial state', () => {
    const expectedResult = state;
    expect(registerPageReducer(undefined, {})).toEqual(expectedResult);
  });

  it('should handle changeUsername correctly', () => {
    expect(registerPageReducer(state, changeUsername('T'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'T';
      }),
    );
    expect(registerPageReducer(state, changeUsername('Te'))).toEqual(
      produce(state, (draft) => {
        draft.username = 'Te';
      }),
    );
    expect(registerPageReducer(state, changeUsername())).toEqual(
      produce(state, (draft) => {
        draft.username = '';
      }),
    );
  });

  it('should handle changePassword correctly', () => {
    expect(registerPageReducer(state, changePassword('T'))).toEqual(
      produce(state, (draft) => {
        draft.password = 'T';
        draft.usernameError = true;
      }),
    );
  });

  it('should handle changeConfirmPassword correctly', () => {
    expect(registerPageReducer(state, changeConfirmPassword('T'))).toEqual(
      produce(state, (draft) => {
        draft.confirmPassword = 'T';
        draft.usernameError = true;
        draft.passwordError = true;
        draft.confirmPasswordError = true;
      }),
    );
  });

  it('should handle registerFailure correctly', () => {
    expect(registerPageReducer(state, registerFailure())).toEqual(
      produce(state, (draft) => {
        draft.registerError = true;
      }),
    );
  });

  it('should handle registerFormLoading correctly', () => {
    expect(registerPageReducer(state, registerFormLoading())).toEqual(
      produce(state, (draft) => {
        draft.loading = true;
      }),
    );
    expect(registerPageReducer(state, registerFormLoading(false))).toEqual(
      produce(state, (draft) => {
        draft.loading = false;
      }),
    );
  });
});
