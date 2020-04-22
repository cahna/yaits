/**
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { EuiHeaderLogo, EuiHeader } from '@elastic/eui';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import history from 'utils/history';
import HomePage from 'containers/HomePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import RegisterPage from 'containers/RegisterPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import withRequireSession from 'containers/withRequireSession';
import withDisallowSession from 'containers/withDisallowSession';

import GlobalStyle from '../../global-styles';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { APP_KEY } from './constants';

const key = APP_KEY;

const ManagedHomePage = withRequireSession(HomePage);
const ManagedLoginPage = withDisallowSession(LoginPage);
const ManagedRegisterPage = withDisallowSession(RegisterPage);

export default function App() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const { formatMessage } = useIntl();
  const onClickGoHome = (e) => {
    e.preventDefault();
    history.push('/');
  };

  const renderLogo = (
    <EuiHeaderLogo
      iconType="compute"
      href="#"
      onClick={onClickGoHome}
      aria-label={formatMessage(messages.logoAriaLabel)}
    />
  );

  const breadcrumbs = [
    {
      text: formatMessage(messages.breadcrumbHome),
      href: '#',
      onClick: onClickGoHome,
    },
  ];

  const sections = [
    {
      items: [renderLogo],
      borders: 'right',
      breadcrumbs,
    },
  ];

  return (
    <>
      <EuiHeader sections={sections} position="fixed" />
      <Switch>
        <Route path="/yaits" component={ManagedHomePage} />
        <Route exact path="/login" component={ManagedLoginPage} />
        <Route exact path="/register" component={ManagedRegisterPage} />
        <Redirect from="/" to="/yaits" />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </>
  );
}
