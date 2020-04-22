import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useIntl, FormattedMessage } from 'react-intl';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet-async';
import { EuiPage, EuiPageBody, EuiPageContent } from '@elastic/eui';

import { useInjectSaga } from 'utils/injectSaga';
import { getDisplayName } from 'utils/hoc';
import { makeSelectAccessToken } from 'containers/App/selectors';
import { APP_KEY } from 'containers/App/constants';
import saga from 'containers/App/saga';
import hoistNonReactStatics from 'hoist-non-react-statics';
import messages from './messages';

export const DisallowSessionHoC = (Component) => {
  const WrappedComponent = (props) => {
    const { accessToken, redirectTo, ...rest } = props;

    useInjectSaga({ key: APP_KEY, saga });
    useEffect(() => {
      if (accessToken) {
        redirectTo('/');
      }
    });

    const { formatMessage } = useIntl();
    const redirecting = formatMessage(messages.unauthorizedRedirect);

    if (accessToken) {
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
    redirectTo: PropTypes.func.isRequired,
  };

  WrappedComponent.displayName = `withDisallowSession(${getDisplayName(
    Component,
  )})`;

  return hoistNonReactStatics(WrappedComponent, Component);
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    redirectTo: (path) => dispatch(push(path)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, DisallowSessionHoC);
