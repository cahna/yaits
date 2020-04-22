import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDisplayName } from 'utils/hoc';
import { makeSelectAccessToken } from 'containers/App/selectors';
import { ROUTE_HOME } from 'containers/App/constants';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const DisallowSessionHoC = (Component) => {
  const WrappedComponent = (props) => {
    const { accessToken, ...rest } = props;

    if (accessToken) {
      return <Redirect to={ROUTE_HOME} />;
    }

    return <Component {...rest} />;
  };

  WrappedComponent.propTypes = {
    accessToken: PropTypes.string,
  };

  WrappedComponent.displayName = `withDisallowSession(${getDisplayName(
    Component,
  )})`;

  return hoistNonReactStatics(WrappedComponent, Component);
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, DisallowSessionHoC);
