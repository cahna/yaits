import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectAccessToken } from 'containers/App/selectors';
import { ROUTE_HOME } from 'containers/App/constants';

export const NoAuthRoute = ({ accessToken, component, render, ...rest }) => {
  if (accessToken) {
    return <Route render={() => <Redirect to={ROUTE_HOME} />} {...rest} />;
  }

  return <Route component={component} render={render} {...rest} />;
};

NoAuthRoute.propTypes = {
  accessToken: PropTypes.string,
  component: PropTypes.func,
  render: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(NoAuthRoute);
