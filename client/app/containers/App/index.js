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
import YaitsApp from 'containers/YaitsApp/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import RegisterPage from 'containers/RegisterPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import AuthRoute from 'containers/AuthRoute';
import NoAuthRoute from 'containers/NoAuthRoute';
import GlobalToasts from 'containers/GlobalToasts/Loadable';

import GlobalStyle from '../../global-styles';
import { APP_KEY, ROUTE_HOME, ROUTE_LOGIN, ROUTE_REGISTER } from './constants';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

const key = APP_KEY;

export default function App() {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const { formatMessage } = useIntl();
  const onClickGoHome = (e) => {
    e.preventDefault();
    history.push(ROUTE_HOME);
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
        <AuthRoute path={ROUTE_HOME} component={YaitsApp} />
        <NoAuthRoute exact path={ROUTE_LOGIN} component={LoginPage} />
        <NoAuthRoute exact path={ROUTE_REGISTER} component={RegisterPage} />
        <Redirect from="/" to={ROUTE_HOME} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalToasts />
      <GlobalStyle />
    </>
  );
}
