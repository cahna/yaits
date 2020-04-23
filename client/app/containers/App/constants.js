/**
 * Action/saga names
 */
export const REQUEST_LOGOUT = 'yaits/App/REQUEST_LOGOUT';
export const LOGOUT_SUCCESS = 'yaits/App/LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'yaits/App/LOGOUT_FAILED';
export const USER_LOGGED_IN = 'yaits/App/USER_LOGGED_IN';
export const GET_ACTIVE_USER = 'yaits/App/GET_ACTIVE_USER';
export const LOADING_ACTIVE_USER = 'yaits/App/LOADING_ACTIVE_USER';
export const ACTIVE_USER_LOADED = 'yaits/App/ACTIVE_USER_LOADED';
export const CREATED_NEW_TEAM = 'yaits/App/CREATED_NEW_TEAM';

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
export const ROUTE_TEAMS = `${ROUTE_HOME}/teams`;
export const ROUTE_CREATE_TEAM = `${ROUTE_HOME}/create-team`;

/**
 * Configuration / other
 */
export const LOCAL_TOKEN_NAME = 'accessToken';
export const APP_KEY = 'global';
