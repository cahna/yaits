/**
 * API routes
 */
export const API_PREFIX = '/api';
export const API_LOGIN = `${API_PREFIX}/auth/login`;
export const API_LOGOUT = `${API_PREFIX}/auth/logout`;
export const API_REGISTER = `${API_PREFIX}/auth/register`;
export const API_ACTIVE_USER = `${API_PREFIX}/auth/active_user`;
export const API_TEAMS = `${API_PREFIX}/teams`;

/**
 * UI routes
 */
export const ROUTE_HOME = '/yaits';
export const ROUTE_LOGIN = '/login';
export const ROUTE_REGISTER = '/register';
export const ROUTE_CREATE_TEAM = `${ROUTE_HOME}/create-team`;
export const ROUTE_TEAMS = `${ROUTE_HOME}/teams`;
export const ROUTE_TEAM = `${ROUTE_TEAMS}/:teamSlug`;
export const ROUTE_TEAM_MEBERS = `${ROUTE_TEAM}/members`;
export const ROUTE_ISSUES = `${ROUTE_TEAM}/issues`;
export const ROUTE_ISSUE = `${ROUTE_ISSUES}/:issueId`;

/**
 * Configuration / other
 */
export const LOCAL_TOKEN_NAME = 'accessToken';
export const LOCAL_REFRESH_TOKEN_NAME = 'refreshToken';
