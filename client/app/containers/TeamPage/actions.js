import {
  REQUEST_ISSUES,
  REQUEST_ISSUES_SUCCESS,
  REQUEST_ISSUES_FAILED,
} from './constants';

export const requestIssues = (teamSlug) => ({
  type: REQUEST_ISSUES,
  payload: { teamSlug },
});

export const requestIssuesSuccess = () => ({ type: REQUEST_ISSUES_SUCCESS });

export const requestIssuesFailed = () => ({ type: REQUEST_ISSUES_FAILED });
