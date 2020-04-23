import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { makeSelectAccessToken } from 'containers/App/selectors';
import { ROUTE_LOGIN } from 'containers/App/constants';

export const AuthRoute = ({ accessToken, component, render, ...rest }) => {
  if (!accessToken) {
    return <Route render={() => <Redirect to={ROUTE_LOGIN} />} {...rest} />;
  }

  return <Route component={component} render={render} {...rest} />;
};

AuthRoute.propTypes = {
  accessToken: PropTypes.string,
  component: PropTypes.func,
  render: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect)(AuthRoute);
