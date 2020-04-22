import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { getDisplayName } from 'utils/hoc';
import { makeSelectAccessToken } from 'containers/App/selectors';
import { ROUTE_LOGIN } from 'containers/App/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const RequireSessionHoC = (Component) => {
  const WrappedComponent = (props) => {
    const { accessToken, currentUser, ...rest } = props;

    if (!accessToken) {
      return <Redirect to={ROUTE_LOGIN} />;
    }

    return <Component {...rest} />;
  };

  WrappedComponent.propTypes = {
    accessToken: PropTypes.string,
  };

  WrappedComponent.displayName = `withRequireSession(${getDisplayName(
    Component,
  )})`;

  return hoistNonReactStatics(WrappedComponent, Component);
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, RequireSessionHoC);
