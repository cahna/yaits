import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet-async';
import { useIntl, FormattedMessage } from 'react-intl';
import { EuiPage, EuiPageBody, EuiPageContent } from '@elastic/eui';

import { useInjectSaga } from 'utils/injectSaga';
import { getDisplayName } from 'utils/hoc';
import {
  makeSelectCurrentUser,
  makeSelectAccessToken,
} from 'containers/App/selectors';
import { getActiveUser } from 'containers/App/actions';
import { APP_KEY } from 'containers/App/constants';
import saga from 'containers/App/saga';
import hoistNonReactStatics from 'hoist-non-react-statics';
import messages from './messages';

export const RequireSessionHoC = (Component) => {
  const WrappedComponent = (props) => {
    const {
      accessToken,
      currentUser,
      redirectTo,
      loadActiveUser,
      ...rest
    } = props;

    useInjectSaga({ key: APP_KEY, saga });
    useEffect(() => {
      if (!accessToken) {
        redirectTo('/login');
      } else if (!currentUser || !currentUser.username) {
        loadActiveUser();
      }
    });

    const { formatMessage } = useIntl();
    const redirecting = formatMessage(messages.unauthorizedRedirect);

    if (!accessToken || !currentUser || !currentUser.username) {
      return (
        <EuiPage>
          <Helmet>
            <title>{redirecting}</title>
            <meta name="description" content={redirecting} />
          </Helmet>
          <EuiPageBody component="div">
            <EuiPageContent
              verticalPosition="center"
              horizontalPosition="center"
            >
              <FormattedMessage {...messages.unauthorizedRedirect} />
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    }

    return <Component {...rest} />;
  };

  WrappedComponent.propTypes = {
    accessToken: PropTypes.string,
    currentUser: PropTypes.shape({ username: PropTypes.string }),
    redirectTo: PropTypes.func.isRequired,
    loadActiveUser: PropTypes.func.isRequired,
  };

  WrappedComponent.displayName = `withRequireSession(${getDisplayName(
    Component,
  )})`;

  return hoistNonReactStatics(WrappedComponent, Component);
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  accessToken: makeSelectAccessToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    redirectTo: (path) => dispatch(push(path)),
    loadActiveUser: () => dispatch(getActiveUser()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, RequireSessionHoC);
