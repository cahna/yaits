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

/**
 * API routes
 */
export const API_LOGIN = '/api/auth/login';
export const API_LOGOUT = '/api/auth/logout';
export const API_REGISTER = '/api/auth/register';
export const API_ACTIVE_USER = '/api/auth/active_user';

/**
 * UI routes
 */
export const ROUTE_HOME = '/';
export const ROUTE_LOGIN = '/login';
export const ROUTE_REGISTER = '/register';

/**
 * Configuration / other
 */
export const LOCAL_TOKEN_NAME = 'accessToken';
export const APP_KEY = 'global';
