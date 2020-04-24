import produce from 'immer';
import {
  REQUEST_ISSUES,
  REQUEST_ISSUES_SUCCESS,
  REQUEST_ISSUES_FAILED,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  issuesLoaded: false,
  issues: [],
};

/* eslint-disable default-case, no-param-reassign */
const teamPageReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case REQUEST_ISSUES:
        draft.loading = true;
        draft.error = false;
        draft.issuesLoaded = false;
        draft.issues = [];
        break;
      case REQUEST_ISSUES_SUCCESS:
        draft.loading = false;
        draft.error = false;
        draft.issues = [...payload.issues];
        draft.issuesLoaded = true;
        break;
      case REQUEST_ISSUES_FAILED:
        draft.loading = false;
        draft.error = true;
        draft.issues = [];
        draft.issuesLoaded = false;
        break;
    }
  });

export default teamPageReducer;
