/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import HomePage from 'containers/HomePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import RegisterPage from 'containers/RegisterPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import withRequireSession from 'containers/withRequireSession';
import withDisallowSession from 'containers/withDisallowSession';

import GlobalStyle from '../../global-styles';
import reducer from './reducer';
import saga from './saga';
import { APP_KEY } from './constants';

const key = APP_KEY;

const ManagedHomePage = withRequireSession(HomePage);
const ManagedLoginPage = withDisallowSession(LoginPage);
const ManagedRegisterPage = withDisallowSession(RegisterPage);

export default function App() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  return (
    <>
      <Switch>
        <Route exact path="/" component={ManagedHomePage} />
        <Route exact path="/login" component={ManagedLoginPage} />
        <Route exact path="/register" component={ManagedRegisterPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </>
  );
}
